import {
    async,
    ComponentFixture,
    inject,
    TestBed,
} from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';<% if(filters.mocha && filters.expect) { %>
import { expect } from 'chai';<% } %><% if(filters.uibootstrap) { %>
import { TooltipModule } from 'ngx-bootstrap';<% } %>
import { FormsModule } from '@angular/forms';<% if(filters.ws) { %>
import { SocketService } from '../../components/socket/socket.service';
import { SocketServiceStub } from '../../components/socket/socket.mock';<% } %>
import { MainComponent } from './main.component';

describe('Component: MainComponent', function() {
    let comp: MainComponent;
    let fixture: ComponentFixture<MainComponent>;
    let httpTestingController: HttpTestingController;
    const mockThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express'];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,<% if(filters.uibootstrap) { %>
                TooltipModule.forRoot(),<% } %>
                HttpClientTestingModule,
            ],
            declarations: [ MainComponent ], // declare the test component<% if(filters.ws) { %>
            providers: [
                { provide: SocketService, useClass: SocketServiceStub },
            ],<% } %>
        }).compileComponents();

        httpTestingController = TestBed.get(HttpTestingController);
    }));

    beforeEach(async(() => {
        fixture = TestBed.createComponent(MainComponent);
        // MainComponent test instance
        comp = fixture.componentInstance;

        /**
         * Trigger initial data binding and run lifecycle hooks
         */
        fixture.detectChanges();
    }));

    it('should attach a list of things to the controller', () => {
        // `GET /api/things` should be made once
        const req = httpTestingController.expectOne('/api/things');<% if(filters.jasmine) { %>
        expect(req.request.method).toEqual('GET');<% } else if(filters.mocha) { %>
        <%= expect() %>req.request.method<%= to() %>.equal('GET');<% } %>

        // Respond with mock data
        req.flush(mockThings);

        // assert that there are no outstanding requests
        httpTestingController.verify();

        <%_ if(filters.jasmine) { -%>expect(comp.awesomeThings).toEqual(mockThings);<%_ } else if(filters.mocha) { -%>
        <%= expect() %>comp.awesomeThings<%= to() %>.equal(mockThings);<% } %>
    });
});
