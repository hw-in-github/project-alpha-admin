import React from 'react'
import { HashRouter, Route, Switch, Redirect} from 'react-router-dom'
import App from './App'
import Admin from './admin'
import Login from './pages/login'
import Home from './pages/home'
import Base from './pages/base'
import Trainer from './pages/trainer'
import User from './pages/user'
import Reserve from './pages/reserve'

export default class ERouter extends React.Component{

    render(){
        return (
            <HashRouter>
                <App>
                    <Switch>
                        <Route path="/login" render={ ()=><Login/> }/>
                        <Route path="/" render={()=>
                            <Admin>
                                <Switch>
                                    <Route path='/home' render={ ()=><Home/> }/>
                                    <Route path='/base' render={ ()=><Base/> }/>
                                    <Route path='/trainer' render={ ()=><Trainer/> }/>
                                    <Route path='/user' render={ ()=><User/> }/>
                                    <Route path='/reserve' render={ ()=><Reserve/> }/>
                                    <Redirect to="/home" />
                                    {/* <Route component={NoMatch} /> */}
                                </Switch>
                            </Admin>         
                        } />
                    </Switch>
                </App>
            </HashRouter>
        );
    }
}