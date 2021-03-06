import { InterfaceBase } from '../../contract/base.document';

const catFields = {
  NAME: 'name',
  AGE: 'age',
  IP_ADDRESS: 'ipAddress',
};

interface Cat extends InterfaceBase {
  readonly name: string;
  readonly age: number;
  readonly ipAddress: string;
}

export {catFields, Cat};
