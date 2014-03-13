<div class="listview dirty{{#if children}} children{{/if}}">
	<div class="toolbar">
		<h1>{{text}}</h1>
		{{#if hasParent}}<div class="navButton">Up</div>{{/if}}
		<div class="thinkDoToggle">{{#if app.state}}Do{{else}}Think{{/if}}</div>
		<input type="text" autocorrect="on" autocapitalize="sentences" />
	</div>
	<div class="content">
		<div class="innerwrapper">
			<div class="scrollwrapper">
				<ul class="list"></ul>
			</div>
		</div>
	</div>
</div>