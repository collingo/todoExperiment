<li class="item">
	<div class="state">
		<input type="checkbox"{{#if done}} checked="checked"{{/if}} />
	</div>
	<div class="text">{{text}}</div>
	{{#if childCount}}<div class="children">{{childCount}}</div>{{/if}}
</li>