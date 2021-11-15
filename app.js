const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: process.env.PORT || 3000
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
	 text: 'Hey there <@${message.user}>!'
	});
});


app.shortcut('escalation_action', async ({ ack, payload, client }) => {
  // Acknowledge shortcut request
  ack();

  try {
    // Call the views.open method using the WebClient passed to listeners
    const result = await client.views.open({
      trigger_id: payload.trigger_id,
	view: {
"type": "modal",
	"callback_id": "casecommment_action",
	"title": {
		"type": "plain_text",
		"text": "My App",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "input",
			"block_id":"cn",
			"element": {
				"type": "plain_text_input",
				"action_id": "case_number"
			},
			"label": {
				"type": "plain_text",
				"text": "Case Number",
				"emoji": true
			}
		},
		{
			"type": "input",
			"block_id":"comm",
			"element": {
				"type": "plain_text_input",
				"action_id": "comment"
			},
			"label": {
				"type": "plain_text",
				"text": "Comment",
				"emoji": true
			}
		}
	]
}
});
 console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});


app.view('casecommment_action',async ({ ack, body, view, client }) => { 
   await ack();
   console.log('<@${body.user.id}> You entered the case number as the ${view.state.values.cn.case_number.value} and case comment as ${view.state.values.comm.comment.value}');
});

(async () => {
  // Start your app
  await app.start();

  console.log('⚡️ Bolt app is running!');
})();