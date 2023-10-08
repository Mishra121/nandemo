import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import JournalPage from "./pages/journal";
import ExpenseManager from "./pages/expenseManager";
import NandemoShell from "./pages/nandemoShell";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignUpPage";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import './theme/custom-tab-bar.css';

setupIonicReact();

const queryClient = new QueryClient()

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/journal-app">
          <JournalPage />
        </Route>
        <Route exact path="/expense-manager">
          <ExpenseManager />
        </Route>
        <Route exact path="/nandemo-select">
          <NandemoShell />
        </Route>
        <Route exact path="/auth/nandemo/login">
          <Login />
        </Route>
        <Route exact path="/auth/nandemo/signup">
          <Signup />
        </Route>
        <Route exact path="/">
          <Redirect to="/nandemo-select" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
  <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;
