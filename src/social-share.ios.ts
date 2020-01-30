import { Frame } from "@nativescript/core/ui/frame";

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
