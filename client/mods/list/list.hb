<div class="listview dirty">
	<div class="toolbar">
		<h1>{{text}}</h1>
		{{#if hasParent}}<div class="navButton">Back</div>{{/if}}
		{{#if contextButton}}<div class="contextButton">{{contextButton}}</div>{{/if}}
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