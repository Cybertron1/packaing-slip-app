import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const shopSchema = new Schema({
  shop: {type: String, required: true},
  accessToken: {type: String, default: null},
  scopes: {type: [String], default: null},
  isInstalled: {type: Boolean, default: false},
  installedOn: {type: Date, default: null},
  uninstalledOn: {type: Date, default: null},
  nonce: {type: String, default: null},
  webhooks: {type: Object, default: {}},
  info: {type: Object, default: {}},
});
export default mongoose.models.Shop || mongoose.model('Shop', shopSchema);
