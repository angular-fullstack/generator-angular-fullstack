import { inject, TestBed } from '@angular/core/testing';
import { ResponseOptions, BaseRequestOptions, Http, ConnectionBackend, Response } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { SocketService } from '../../components/socket/socket.service';
import { SocketServiceMock } from '../../components/socket/socket.mock';

import { MainComponent } from './main.component';

describe('Component: MainComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory(backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {provide: SocketService, useClass: SocketServiceMock},
        MainComponent,
      ]
    });
  });

  beforeEach(inject([MockBackend], (backend: MockBackend) => {
    const baseResponse = new Response(new ResponseOptions({ body: 'status' }));
    backend.connections.subscribe((c: MockConnection) => {
      // GET: /things
      if(c.request.url.indexOf('/api/things') >= 0 && c.request.method === 0) {
        let res = new Response(new ResponseOptions({
          body: JSON.stringify([
            {name: '0', description: '0'},
            {name: '1', description: '1'},
            {name: '2', description: '2'},
            {name: '3', description: '3'},
          ])
        }));

        return c.mockRespond(res);
      } else {
        c.mockRespond(baseResponse);
      }
    });
  }));

  it('should have http', inject([MainComponent], mainComponent => {
    <%_ if(filters.jasmine) { -%>
    expect(!!mainComponent.http).toEqual(true);<% } %>
    <%_ if(filters.mocha) { -%>
    <%= expect() %>!!mainComponent.http<%= to() %>.equal(true);<% } %>
  }));
  <%_ if(filters.socketio) { -%>

  it('should have socketService', inject([MainComponent], mainComponent => {
    <%_ if(filters.jasmine) { -%>
    expect(!!mainComponent.socketService).toEqual(true);<% } %>
    <%_ if(filters.mocha) { -%>
    <%= expect() %>!!mainComponent.socketService<%= to() %>.equal(true);<% } %>
  }));<% } %>

  it('should attach a list of things to the controller', inject([MainComponent], mainComponent => {
    <%_ if(filters.jasmine) { -%>
    expect(mainComponent.awesomeThings.length).toBe(0);<% } %>
    <%_ if(filters.mocha) { -%>
    <%= expect() %>mainComponent.awesomeThings.length<%= to() %>.equal(0);<% } %>

    mainComponent.ngOnInit();

    <%_ if(filters.jasmine) { -%>
    expect(mainComponent.awesomeThings.length).toBe(4);<% } %>
    <%_ if(filters.mocha) { -%>
    <%= expect() %>mainComponent.awesomeThings.length<%= to() %>.equal(4);<% } %>
  }));
});