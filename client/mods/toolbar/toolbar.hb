<div class="toolbar dirty">
	<h1>{{text}}</h1>
	{{#if hasParent}}<div class="navButton">Up</div>{{/if}}
	<div class="thinkDoToggle">{{#if app.state}}Do{{else}}Think{{/if}}</div>
	<input type="text" autocorrect="on" autocapitalize="sentences" />
</div>