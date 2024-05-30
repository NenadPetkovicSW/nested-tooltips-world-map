import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

interface Resource {
    id: string;
    name: string;
}

// In-memory data store
let resources: Resource[] = [];

// Utility functions

const getAllResources = (): Resource[] => {
    return resources;
};

const getResourceById = (id: string): Resource | undefined => {
    return resources.find(resource => resource.id === id);
};

const createResource = (data: Resource): Resource => {
    resources.push(data);
    return data;
};

const updateResource = (id: string, data: Partial<Resource>): Resource | undefined => {
    const index = resources.findIndex(resource => resource.id === id);
    if (index !== -1) {
        resources[index] = { ...resources[index], ...data };
        return resources[index];
    }
    return undefined;
};

// Routes

app.get('/api/resources', (req: Request, res: Response) => {
    const allResources = getAllResources();
    res.json(allResources);
});

app.get('/api/resources/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const resource = getResourceById(id);
    if (resource) {
        res.json(resource);
    } else {
        res.status(404).send('Resource not found');
    }
});

app.post('/api/resources', (req: Request, res: Response) => {
    const data: Resource = req.body;
    const newResource = createResource(data);
    res.status(201).json(newResource);
});

app.put('/api/resources/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;
    const updatedResource = updateResource(id, data);
    if (updatedResource) {
        res.json(updatedResource);
    } else {
        res.status(404).send('Resource not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
