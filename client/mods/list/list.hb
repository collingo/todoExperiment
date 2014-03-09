<div class="listview dirty">
	<div class="toolbar">
		<h1>{{text}}</h1>
		{{#if hasParent}}<div class="navButton">Up</div>{{/if}}
		<div class="thinkDoToggle">{{#if app.state}}Do{{else}}Think{{/if}}</div>
	</div>
	<div class="wrapper">
		<div class="innerwrapper">
			<div class="scrollwrapper">
				<input type="text" />
				<ul class="list"></ul>
			</div>
		</div>
	</div>
</div>