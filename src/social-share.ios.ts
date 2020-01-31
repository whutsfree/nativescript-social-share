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
  const activityController = UIActivityViewController.extend({
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

export function shareText(text, callback = null) {
  share([text], callback);
}

export function shareUrl(url, text, callback = null) {
  share([NSURL.URLWithString(url), text], callback);
}

export function setShareView(nativeView: any) {
    SHARE_VIEW.view = nativeView;
}
