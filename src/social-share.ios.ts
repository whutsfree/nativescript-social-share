import { Frame } from "@nativescript/core/ui/frame";

declare class CGPoint {
    x: number;
    y: number;
}
declare class CGSize {
    width: number;
    height: number;
}
declare class CGRect {
    origin: CGPoint;
    size: CGSize;
}

const SHARE_VIEW = {
    view: null
};

function share(thingsToShare, callback = null) {
  const activityController = (UIActivityViewController as any).extend({
      didDisappear: false,
      viewDidAppear: function(animated: boolean): void {
          this.didDisappear = false;
      },
      viewDidDisappear: function(animated: boolean): void {
          this.didDisappear = true;
      }
  }).alloc()
        .initWithActivityItemsApplicationActivities(thingsToShare, null);

  const presentViewController = activityController.popoverPresentationController;
  if (presentViewController) {
    const page = Frame.topmost().currentPage;
    if (page && page.ios.navigationItem.rightBarButtonItems &&
      page.ios.navigationItem.rightBarButtonItems.count > 0) {
      presentViewController.barButtonItem = page.ios.navigationItem.rightBarButtonItems[0];
    } else {
      if (SHARE_VIEW.view) {
          presentViewController.sourceView = SHARE_VIEW.view;
      } else {
          const rect = new CGRect();
          rect.origin = new CGPoint();
          rect.size = new CGSize();
          rect.origin.x = page.ios.view.bounds.origin.x;
          rect.origin.y = page.ios.view.bounds.origin.y;
          rect.size.width = page.ios.view.bounds.size.width;
          rect.size.height = page.ios.view.bounds.size.height;
          presentViewController.sourceView = page.ios.view;
          presentViewController.sourceRect = rect;
      }
    }
  }
  SHARE_VIEW.view = null;

  if (callback) {
      activityController.completionWithItemsHandler = () => {
          if (activityController.didDisappear) {
              callback();
          }
      };
  }
  Frame.topmost().ios.controller
    .presentViewControllerAnimatedCompletion(activityController, true, null);
}

export function shareImage(image, subject, text, callback = null) {
  share([image, text], callback);
}

export function shareText(text, subject, callback = null) {
  share([text], callback);
}

export function shareUrl(url, text, subject, callback = null) {
  share([NSURL.URLWithString(url), text], callback);
}

export function shareUrlImageText(url, image, text, subject, callback = null) {
    share([createUIActivityItemProviderImageOrURL(NSURL.URLWithString(url), image), text], callback);
}

export function setShareView(nativeView: any) {
    SHARE_VIEW.view = nativeView;
}

function createUIActivityItemProviderImageOrURL(url: any, image: any) {
    return (UIActivityItemProvider as any).extend({
        activityViewControllerItemForActivityType: function(activityViewController: UIActivityViewController, activityType: string): any {
            // com.burbn.instagram.shareextension
            // com.apple.UIKit.activity.Message
            // com.apple.UIKit.activity.Mail
            // com.apple.UIKit.activity.PostToFacebook
            // com.facebook.Messenger.ShareExtension
            if (activityType === "com.apple.UIKit.activity.PostToFacebook" ||
                activityType === "com.facebook.Messenger.ShareExtension"
            ) {
                // facebook doesn't seem to allow text with a link in addition to an image, so use the url instead
                return url;
            } else {
                return image;
            }
        }
    }).alloc().initWithPlaceholderItem(image);
}
