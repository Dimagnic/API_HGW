/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const completed = e.record.get("completed");
  const original = e.record.original();
  const wasCompleted = original.get("completed");
  
  if (completed && !wasCompleted) {
    const userId = e.record.get("userId");
    const courseId = e.record.get("courseId");
    
    if (userId && courseId) {
      const course = $app.findRecordById("courses", courseId);
      const user = $app.findRecordById("users", userId);
      
      if (course && user) {
        const notification = new Record($app.findCollectionByNameOrId("notifications"));
        notification.set("userId", userId);
        notification.set("type", "system");
        notification.set("title", "Certificate Earned!");
        notification.set("message", "Congratulations! You have completed the course '" + course.get("title") + "' and earned a certificate.");
        notification.set("isRead", false);
        
        $app.save(notification);
      }
    }
  }
  
  e.next();
}, "user_progress");