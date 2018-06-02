import Generator from 'yeoman-generator';
import { Base } from '../generator-base';

class RouteGenerator extends Base {
  compose() {
    this.composeWith(
    	require.resolve('generator-angular-fullstack-component/generators/route'),
    	{arguments: this.arguments},
	);
  }
}
module.exports = RouteGenerator;
