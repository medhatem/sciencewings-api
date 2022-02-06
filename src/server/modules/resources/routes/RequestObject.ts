import { dto, include } from 'dto-mapper';

@dto()
export class CreateResourceRO {
  @include()
  name: string;

  @include()
  parentId?: string;
}
