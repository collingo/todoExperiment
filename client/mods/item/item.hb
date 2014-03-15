<li class="item dirty{{#unless _id}} updating{{/unless}}{{#unless id}} deleting{{/unless}}{{#if childCount}} children{{/if}}">
	<div class="delete"></div>
	{{#if childCount}}
		<div class="children">{{childCount}}</div>
	{{else}}
		<div class="state">
			<input type="checkbox"{{#if done}} checked="checked"{{/if}} />
		</div>
	{{/if}}
	<div class="text">{{text}}</div>
</li>