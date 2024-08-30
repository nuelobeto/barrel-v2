import {BrowserRouter} from 'react-router-dom';
import AppRouter from './router/AppRouter';
import Toast from '@/components/ui/toast';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import {pdfjs} from 'react-pdf';
import QueryProvider from './context/query-provider';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const App = () => {
  return (
    <BrowserRouter>
      <QueryProvider>
        <AppRouter />
      </QueryProvider>
      <Toast />
    </BrowserRouter>
  );
};

export default App;
