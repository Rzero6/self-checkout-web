import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import publicRoutes from "@/routes/PublicRoutes";
import NotFound from "./pages/404/Index";

const queryClient = new QueryClient();

function renderRouteGroup(routeGroup: any) {
  return (
    <Route element={routeGroup.element}>
      {routeGroup.children.map((route: any) => (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        />
      ))}
    </Route>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position="bottom-right" />
      <BrowserRouter>
        <Routes>
          {renderRouteGroup(publicRoutes)}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
