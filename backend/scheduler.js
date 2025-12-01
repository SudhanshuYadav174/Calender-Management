const cron = require("node-cron");
const Event = require("./models/Event");
const User = require("./models/User");
const mailer = require("./utils/mailer");

// Helper to compute DateTime from event date and time and subtract minutes
function getReminderUTCDate(eventDate, timeStr, minutesBefore) {
  // date expected 'YYYY-MM-DD', time 'HH:mm'
  const [h, m] = timeStr.split(":").map(Number);
  const [y, mo, d] = eventDate.split("-").map(Number);
  // Use local time instead of UTC to match user's timezone
  const dt = new Date(y, mo - 1, d, h, m);
  dt.setMinutes(dt.getMinutes() - minutesBefore);
  return dt;
}

module.exports = {
  start: () => {
    // Run every minute
    cron.schedule("* * * * *", async () => {
      try {
        const now = new Date();
        console.log(`🔍 Scheduler running at: ${now.toLocaleString()}`);

        // Find events that have reminders not notified and whose reminder time <= now
        const events = await Event.find({
          "reminders.notified": false,
        }).populate("user");

        console.log(`📋 Found ${events.length} events with pending reminders`);

        for (const ev of events) {
          for (const reminder of ev.reminders) {
            if (reminder.notified) continue;

            const reminderDate = getReminderUTCDate(
              ev.date,
              ev.startTime,
              reminder.minutesBefore
            );

            console.log(
              `  Event: "${ev.title}" on ${ev.date} at ${ev.startTime}`
            );
            console.log(
              `  Reminder should fire at: ${reminderDate.toLocaleString()}`
            );
            console.log(`  Current time: ${now.toLocaleString()}`);
            console.log(`  Should send? ${reminderDate <= now}`);

            if (reminderDate <= now) {
              // send notification
              const user = ev.user;
              const subject = `⏰ Reminder: ${ev.title}`;
              const text = `Event "${ev.title}" is scheduled on ${ev.date} at ${
                ev.startTime
              } - ${ev.endTime}. ${ev.description || ""}`;

              // Beautiful HTML email template
              const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 20px;">
                  <div style="background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                    <div style="text-align: center; margin-bottom: 30px;">
                      <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                        <span style="font-size: 30px;">⏰</span>
                      </div>
                      <h1 style="color: #7c3aed; margin: 0; font-size: 28px;">Event Reminder</h1>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
                      <h2 style="color: white; margin: 0 0 15px 0; font-size: 24px;">${
                        ev.title
                      }</h2>
                      ${
                        ev.description
                          ? `<p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">${ev.description}</p>`
                          : ""
                      }
                    </div>
                    
                    <div style="background: #f7f7f7; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                      <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <span style="font-size: 20px; margin-right: 10px;">📅</span>
                        <div>
                          <div style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Date</div>
                          <div style="color: #333; font-size: 16px; font-weight: bold;">${new Date(
                            ev.date
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}</div>
                        </div>
                      </div>
                      
                      <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <span style="font-size: 20px; margin-right: 10px;">🕐</span>
                        <div>
                          <div style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Time</div>
                          <div style="color: #333; font-size: 16px; font-weight: bold;">${
                            ev.startTime
                          } - ${ev.endTime}</div>
                        </div>
                      </div>
                      
                      ${
                        ev.location
                          ? `
                      <div style="display: flex; align-items: center;">
                        <span style="font-size: 20px; margin-right: 10px;">📍</span>
                        <div>
                          <div style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Location</div>
                          <div style="color: #333; font-size: 16px; font-weight: bold;">${ev.location}</div>
                        </div>
                      </div>
                      `
                          : ""
                      }
                    </div>
                    
                    <div style="text-align: center; padding: 20px; background: #fff9e6; border-left: 4px solid #fbbf24; border-radius: 8px; margin-bottom: 20px;">
                      <p style="margin: 0; color: #92400e; font-weight: 500;">
                        ⚠️ This event is starting in ${
                          reminder.minutesBefore
                        } minutes!
                      </p>
                    </div>
                    
                    <div style="text-align: center;">
                      <p style="color: #666; font-size: 12px; margin: 0;">
                        You're receiving this because you set up a reminder for this event.
                      </p>
                    </div>
                  </div>
                  
                  <div style="text-align: center; margin-top: 20px;">
                    <p style="color: white; font-size: 12px; margin: 0;">One Calendar - Your Digital Event Manager</p>
                  </div>
                </div>
              `;

              // Try email
              if (user && user.email) {
                await mailer.sendMail(user.email, subject, text, html);
              }
              // mark this reminder as notified
              reminder.notified = true;
              console.log(
                `✅ Reminder sent for event "${ev.title}" to ${user.email} (${reminder.minutesBefore} minutes before)`
              );
            }
          }
          await ev.save();
        }
      } catch (err) {
        console.error("Scheduler error:", err);
      }
    });
    console.log("Scheduler started (cron every minute)");
  },
};
