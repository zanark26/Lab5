import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import RouterService from "../routers/RouterService"
import Transaction from "./Transaction"
import Setting from "./Setting"
import Customer from "./Customer";
const Tab = createMaterialBottomTabNavigator()

const Admin = () => {
    return (
        <Tab.Navigator
        >
            <Tab.Screen name="RouterService" component={RouterService}
                options={{
                    title:"Home",
                    tabBarIcon: "home"
                }}
            />
            <Tab.Screen name="Transaction" component={Transaction}
                options={{
                    tabBarIcon:"cash"
                }}
            />
            <Tab.Screen name="Customers" component={Customer}
                options={{
                    tabBarIcon:"account"
                }}
            />
            <Tab.Screen name="Setting" component={Setting}
                options={{
                    tabBarIcon:"cog"
                }}
            />
        </Tab.Navigator>
    )
}

export default Admin