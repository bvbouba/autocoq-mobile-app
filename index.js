import { AppRegistry } from 'react-native';
import App from './App'; // Ensure this matches your main component file
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
