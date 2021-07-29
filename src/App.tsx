import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Home } from '../src/pages/Home/Home'
import { Room } from './pages/Room/index';
import { NewRoom } from '../src/pages/NewRoom/index'

import { AuthContextProvider } from './contexts/AuthContext'
import { AdminRoom } from './pages/AdminRoom';

function App() {
  return (
    // configuração de rotas
    // Switch -> se uma rota for acessada, ele vai parar de procurar por outras
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" component={NewRoom} />
          {/* :id -> recebendo o parâmetro */}
          <Route path="/rooms/:id" component={Room} />
          <Route path="/admin/rooms/:id" component={AdminRoom} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
