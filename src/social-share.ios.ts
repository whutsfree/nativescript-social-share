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

const SHARE_RECT = new CGRect();
SHARE_RECT.origin = new CGPoint();
SHARE_RECT.size = new CGSize();

function share(thingsToShare, callback = null) {
  const activityController = UIActivityViewController.alloc()
      .initWithActivityItemsApplicationActivities(thingsToShare, null);

  const presentViewController = activityController.popoverPresentationController;
  if (presentViewController) {
    const page = Frame.topmost().currentPage;
    if (page && page.ios.navigationItem.rightBarButtonItems &&
      page.ios.navigationItem.rightBarButtonItems.count > 0) {
      presentViewController.barButtonItem = page.ios.navigationItem.rightBarButtonItems[0];
    } else {
      presentViewController.sourceView = page.ios.view;
      if (SHARE_RECT.size.width === 0 || SHARE_RECT.size.height === 0) {
          SHARE_RECT.size.width = page.ios.view.bounds.size.width;
          SHARE_RECT.size.height = page.ios.view.bounds.size.height;
      }
      presentViewController.sourceRect = SHARE_RECT;
    }
  }

  if (callback) {
      activityController.completionWithItemsHandler = () => {
          callback();
      };
  }
  Frame.topmost().ios.controller
    .presentViewControllerAnimatedCompletion(activityController, true, null);
}

export function shareImage(image, subject, text, callback = null) {
  share([image, text], callback);
}

export function shareText(text, callback = null) {
  share([text], callback);
}

export function shareUrl(url, text, callback = null) {
  share([NSURL.URLWithString(url), text], callback);
}

export function setShareRect(x: number, y: number, width: number, height: number) {
    SHARE_RECT.origin.x = x;
    SHARE_RECT.origin.y = y;
    SHARE_RECT.size.width = width;
    SHARE_RECT.size.height = height;
}
