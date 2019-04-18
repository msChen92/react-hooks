import React, { Component } from 'react'
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import Storage from './utils/storage'
import routerConfig from './config/routerConfig'
import {connect} from 'react-redux'
import { actionCreators } from "./store/module/common";
import App from './App'
import Login from './pages/login'
import Layout from './layout/layout'
import Home from './pages/home'
import Category from './pages/product/category'
import CategoryAdd from './pages/product/category/add'
import Product from './pages/product/product'
import ProductDetail from './pages/product/product/handle'
import Order from './pages/order'
import OrderDetail from './pages/order/detail'
import User from './pages/user';

import NoMatch from './pages/nomatch'

const storage = new Storage()
class Router extends Component {
  render() {
    return (
      <HashRouter>
        <App>
          <Switch>
            <Route exact path='/login' component={Login} />
            <Route path='/' render={() => {
              const userinfo = this.props.userInfo.toJS();
              if (!userinfo.id) {
                const storageUserinfo = storage.getStorage('userinfo')
                if (!storageUserinfo.id) {
                  return (
                    <Redirect to='/login' />
                  )
                } else {
                  const { dispatch } = this.props;
                  dispatch(actionCreators.setUserinfo(storageUserinfo));
                }
              }
              return (
              <Layout>
                <Switch>
                  <Route path="/home" component={Home} />
                  <Route path="/product/category/add" component={CategoryAdd} />
                  <Route path="/product/category/:categoryId" component={Category} />
                  <Route path="/product/index" component={Product} />
                  <Route exact path="/product/product" component={ProductDetail} />
                  <Route exact path="/product/product/:productId" component={ProductDetail} />
                  <Route exact path="/product/product/:productId/:detail" component={ProductDetail} />
                  <AuthorizedRoute path="/order/list" component={Order} />
                  <AuthorizedRoute path="/order/detail/:id" component={OrderDetail} />
                  <AuthorizedRoute path="/user" component={User} />
                  
                  <Redirect to='/home' />
                  <Route component={NoMatch} />
                </Switch>
              </Layout>
            )}} />
          </Switch>
        </App>
      </HashRouter>
    )
  }
}

class AuthorizedRoute extends Component{
  render() {
    const {component: Component, ...rest} = this.props
    const userinfo = this.props.userInfo.toJS();
    const userrole = userinfo.role;
    
    const item = routerConfig.filter(item => item.key === {...rest}.path)[0]
    return (
      <Route render={props => {
        return item.role.includes(userrole) ? 
          <Component {...props} /> :
          <div>暂未权限访问该页面</div>
      }} />
    )
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.getIn(['common', 'userinfo'])
  }
};

export default connect(mapStateToProps)(Router)