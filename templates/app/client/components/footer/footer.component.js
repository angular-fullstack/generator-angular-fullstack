import { Component } from '@angular/core';

@Component({
    selector: 'footer',
    template: require('./footer.<%=templateExt%>'),
    styles: [require('./footer.<%=styleExt%>')]
})
export class FooterComponent {}
