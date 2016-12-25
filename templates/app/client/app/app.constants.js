<%_ if(filters.babel) { -%>
export default from '../../server/config/environment/shared';<% } %>
<%_ if(filters.ts) { -%>
import shared from '../../server/config/environment/shared';

module.exports.default = shared;<% } %>
