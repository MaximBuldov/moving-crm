import Menu from "./components/Menu";
import React, {useMemo} from "react";
import logo from "./assets/logo-white.png"
import AppRouter from "./components/AppRouter";
import {useDispatch, useSelector} from "react-redux";
import {allRoutes} from "./routes";
import {Layout} from "antd";
import {collapseMenu} from "./store/slices/appSlice";
import classNames from "classnames";


function App() {
    const {user: {data}, app: {collapsed}} = useSelector((state) => state)
    const routes = useMemo(() => allRoutes(data?.user_role), [data?.user_role])
    const dispatch = useDispatch()
    const handelCollapseMenu = () => {
        if (!collapsed && window.innerWidth < 900) {
            dispatch(collapseMenu())
        }
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout.Sider
                className="site-sidebar"
                collapsible
                collapsed={false}
                trigger={null}
            >
                <img src={logo} className="white-logo" alt="logo" />
                <Menu routes={routes} />
            </Layout.Sider>

            <Layout onClick={handelCollapseMenu}  style={{transition: '0.5s'}} className={classNames({'site-layout': !collapsed, 'site-layout-collapsed': collapsed})}>
                <Layout.Content style={{ margin: '0 16px' }}>
                    <div className="site-layout-background" style={{ padding: '24px 0', minHeight: '100vh' }}>
                        <AppRouter routes={routes} />
                    </div>
                </Layout.Content>
            </Layout>
        </Layout>
      );
}

export default App;
