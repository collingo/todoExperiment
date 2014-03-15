<li class="item dirty{{#unless id}} unsaved{{/unless}}{{#if childCount}} children{{/if}}">
	{{#if childCount}}
		<div class="children">{{childCount}}</div>
	{{else}}
		<div class="state">
			<input type="checkbox"{{#if done}} checked="checked"{{/if}} />
		</div>
	{{/if}}
	<div class="text">{{text}}</div>
</li>