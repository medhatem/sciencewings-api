import { Path, Accept, GET, QueryParam } from 'typescript-rest';
import { Tags } from 'typescript-rest-swagger';

@Path('mypath')
export class MyService {
  @GET
  @Tags('adminMethod', 'otheTag')
  @Accept('text/html')
  test(): string {
    return 'OK';
  }

  @GET
  @Path('secondpath')
  test2(@QueryParam('testParam') test?: string): any {
    return { name: 'OK' };
  }
}
