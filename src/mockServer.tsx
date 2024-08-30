import {createMiddleware} from '@mswjs/http-middleware';
import {HttpResponse, RequestHandler, http} from 'msw';
import express from 'express';
import cors from 'cors';
import {DroppedItem, IDocument} from './types/document';

const documents: IDocument[] = [
  {
    id: '212',
    title: 'Document 1',
    status: 'published',
    content: [
      {
        page: 1,
        imageUrl:
          'https://res.cloudinary.com/dspbvhlt6/image/upload/v1723794083/nysc_byo4hn.png',
        components: [],
      },
      {
        page: 2,
        imageUrl:
          'https://res.cloudinary.com/dspbvhlt6/image/upload/v1723794083/nysc_byo4hn.png',
        components: [],
      },
    ],
    updatedAt: null,
  },
  {
    id: '2',
    title: 'Document 2',
    status: 'draft',
    content: [
      {
        page: 1,
        imageUrl:
          'https://res.cloudinary.com/dspbvhlt6/image/upload/v1723795806/omoeux_nculv3.png',
        components: [],
      },
      {
        page: 2,
        imageUrl: 'https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK2',
        components: [],
      },
    ],
    updatedAt: '2024-08-01T00:00:00.000Z',
  },
];

const corsOptions = {
  origin: process.env.VITE_WEB_URL,
  credentials: true,
};

// app setup
const app = express();
app.use(cors(corsOptions));
app.use(express.json());

const handlers: RequestHandler[] = [
  // GET /documents
  http.get('/documents', () => {
    return HttpResponse.json({
      data: documents,
      total: documents.length,
      error: null,
    });
  }),

  // GET /documents/:id
  http.get<{id: string}>('/documents/:id', async ({params}) => {
    const document = documents.find(doc => doc.id === params.id);

    if (!document) {
      return HttpResponse.json(
        {
          data: null,
          error: 'Document not found',
        },
        {
          status: 404,
        },
      );
    }

    return HttpResponse.json({
      data: document,
      error: null,
    });
  }),

  // PATCH /documents/:id
  http.patch<{id: string}>('/documents/:id', async ({params, request}) => {
    const document = documents.find(doc => doc.id === params.id);

    if (!document) {
      return HttpResponse.json(
        {
          data: null,
          error: 'Document not found',
        },
        {
          status: 404,
        },
      );
    }

    const {title, content} = (await request.json()) as {
      title?: string;
      content?: {
        page: number;
        imageUrl: string;
        components: DroppedItem[];
      }[];
    };

    if (title !== undefined) document.title = title;

    if (content !== undefined) {
      content.forEach(pageContent => {
        const pageIndex = document.content.findIndex(
          p => p.page === pageContent.page,
        );
        if (pageIndex !== -1) {
          // Page exists, merge components
          const existingComponents = document.content[pageIndex].components;
          const updatedComponents = [
            ...existingComponents.filter(
              comp =>
                !pageContent.components.some(newComp => newComp.id === comp.id),
            ),
            ...pageContent.components,
          ];
          document.content[pageIndex].components = updatedComponents;
        } else {
          // Page does not exist, add new page
          document.content.push(pageContent);
        }
      });
    }

    document.updatedAt = new Date().toISOString();

    return HttpResponse.json({
      data: document,
      error: null,
    });
  }),
];

app.use(createMiddleware(...handlers));
app.listen(process.env.VITE_TEST_SERVER_PORT, () => {
  console.log(
    `Mock Server listening on port ${process.env.VITE_TEST_SERVER_PORT}`,
  );
});
