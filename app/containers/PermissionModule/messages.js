/*
 * PermissionModule Messages
 *
 */
import { defineMessages } from 'react-intl';

export const scope = 'containers.PermissionModule';

export default defineMessages({
  helmetTitle: {
    id: `${scope}.helmetTitle`,
    defaultMessage: 'Permission',
  },
  editTitle: {
    id: `${scope}.editTitle`,
    defaultMessage: 'Edit Permission',
  },
  addTitle: {
    id: `${scope}.addTitle`,
    defaultMessage: 'Add Permission',
  },
  resourceLabel: {
    id: `${scope}.resourceLabel`,
    defaultMessage: 'Resource',
  },
  resourcePlaceHolder: {
    id: `${scope}.resourcePlaceHolder`,
    defaultMessage: 'Input resource name',
  },
  descriptionLabel: {
    id: `${scope}.descriptionLabel`,
    defaultMessage: 'Description',
  },
  descriptionPlaceHolder: {
    id: `${scope}.descriptionPlaceHolder`,
    defaultMessage: 'Input description',
  },
  pathLabel: {
    id: `${scope}.pathLabel`,
    defaultMessage: 'Path',
  },
  pathPlaceHolder: {
    id: `${scope}.pathPlaceHolder`,
    defaultMessage: 'Input path name',
  },
  methodLabel: {
    id: `${scope}.methodLabel`,
    defaultMessage: 'Method',
  },
  methodPlaceHolder: {
    id: `${scope}.methodPlaceHolder`,
    defaultMessage: 'Input method name',
  },
  dateLabel: {
    id: `${scope}.dateLabel`,
    defaultMessage: 'Created At',
  },
  addLabel: {
    id: `${scope}.addLabel`,
    defaultMessage: 'Add New',
  },
  actionLabel: {
    id: `${scope}.actionLabel`,
    defaultMessage: 'Action',
  },
  createdAt: {
    id: `${scope}.createdAt`,
    defaultMessage: '{ts, date, ::yyyyMMdd}',
  },
  listTitle: {
    id: `${scope}.listTitle`,
    defaultMessage: 'Permissions',
  },
});