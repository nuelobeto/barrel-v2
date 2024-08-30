import {Checkbox} from '@/components/ui/checkbox';
import {DraggableItem} from '@/types/document';

export const draggableItems: DraggableItem[] = [
  {
    id: 'recipientSignature',
    label: 'Recipient’s signature',
    component: <div className="font-signature">Signature</div>,
    exampleInfo: <div className="font-signature">John Doe</div>,
  },
  {
    id: 'textFields',
    label: 'Text fields',
    component: <div>Text field</div>,
    exampleInfo: <div>Text here</div>,
  },
  {
    id: 'initials',
    label: 'Initials',
    component: <div>Initials</div>,
    exampleInfo: <div>J.D.</div>,
  },
  {
    id: 'checkbox',
    label: 'Checkbox',
    component: <Checkbox />,
    exampleInfo: <Checkbox />,
  },
  {
    id: 'signature',
    label: 'Signature',
    component: <div className="font-signature">Signature</div>,
    exampleInfo: <div className="font-signature">Jane Doe</div>,
  },
  {
    id: 'signatoryTitle',
    label: 'Signatory’s title',
    component: <div>Signatory’s title</div>,
    exampleInfo: <div>Chief Executive Officer</div>,
  },
  {
    id: 'signatoryFullname',
    label: 'Signatory’s full name',
    component: <div>Signatory’s full name</div>,
    exampleInfo: <div>Jane Doe</div>,
  },
  {
    id: 'firstname',
    label: 'First name',
    component: <div>First name</div>,
    exampleInfo: <div>John</div>,
  },
  {
    id: 'lastname',
    label: 'Last name',
    component: <div>Last name</div>,
    exampleInfo: <div>Doe</div>,
  },
  {
    id: 'fullname',
    label: 'Full name',
    component: <div>Full name</div>,
    exampleInfo: <div>John Doe</div>,
  },
  {
    id: 'email',
    label: 'Email address',
    component: <div>Email address</div>,
    exampleInfo: <div>johndoe@example.com</div>,
  },
  {
    id: 'startdate',
    label: 'Start date',
    component: <div>Start date placeholder</div>,
    exampleInfo: <div>01/01/2024</div>,
  },
  {
    id: 'dob',
    label: 'Date of birth',
    component: <div>Date of birth placeholder</div>,
    exampleInfo: <div>01/01/1980</div>,
  },
];
