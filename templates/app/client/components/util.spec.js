import { safeCb } from './util';
<% if(filters.mocha && filters.expect) { %>
import { expect } from 'chai';<% } %>

describe('Util', () => {
    it('Has a safeCb function', () => {
        let notAFunction = undefined;

        <%_ if (filters.jasmine) { -%>
        expect(safeCb(notAFunction)).not.toThrowError();
        <%_ } if (filters.mocha) { -%>
        <%= expect() %>safeCb(notAFunction)<%= to() %>.not.throw(Error);
        <%_ } -%>
    });
});
