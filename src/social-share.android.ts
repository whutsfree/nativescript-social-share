import * as application from "tns-core-modules/application";
import * as platform from "tns-core-modules/platform";

let context;
let numberOfImagesCreated = 0;
declare var global: any;
const FileProviderPackageName = useAndroidX() ? global.androidx.core.content : android.support.v4.content;

function getIntent(type) {
  const intent = new android.content.Intent(android.content.Intent.ACTION_SEND);
  intent.setType(type);
  return intent;
}
function share(intent, subject) {
  context = application.android.context;
  subject = subject || "How would you like to share this?";

  const shareIntent = android.content.Intent.createChooser(intent, subject);
  shareIntent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
  context.startActivity(shareIntent);
}
function useAndroidX () {
  return global.androidx && global.androidx.appcompat;
}

export function shareImage(image, subject, text) {
  numberOfImagesCreated ++;

  context = application.android.context;

  const intent = getIntent("image/jpeg");

  const stream = new java.io.ByteArrayOutputStream();
  image.android.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, stream);

  const imageFileName = "socialsharing" + numberOfImagesCreated + ".jpg";
  const newFile = new java.io.File(context.getExternalFilesDir(null), imageFileName);

  const fos = new java.io.FileOutputStream(newFile);
  fos.write(stream.toByteArray());

  fos.flush();
  fos.close();

  let shareableFileUri;
  const sdkVersionInt = parseInt(platform.device.sdkVersion);
  if (sdkVersionInt >= 21) {
    shareableFileUri = FileProviderPackageName.FileProvider.getUriForFile(context, application.android.nativeApp.getPackageName() + ".provider", newFile);
  } else {
    shareableFileUri = android.net.Uri.fromFile(newFile);
  }
  if (text) {
      intent.putExtra(android.content.Intent.EXTRA_TEXT, text);
  }
  intent.putExtra(android.content.Intent.EXTRA_STREAM, shareableFileUri);

  share(intent, subject);
}

export function shareText(text, subject) {
  const intent = getIntent("text/plain");

  intent.putExtra(android.content.Intent.EXTRA_TEXT, text);
  share(intent, subject);
}

export function shareUrl(url, text, subject) {
  const intent = getIntent("text/plain");

  intent.putExtra(android.content.Intent.EXTRA_TEXT, url);
  intent.putExtra(android.content.Intent.EXTRA_SUBJECT, text);

  share(intent, subject);
}
