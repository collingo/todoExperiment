<ul class="list" repeat="todo.children">
	<li class="item" model="todo">
		<a href="/{{id}}">
			<div class="delete"></div>
			<div class="children">{{childCount}}</div>
			<div class="state">
				<input type="checkbox" checked="{{done}}" />
			</div>
			<div class="text">{{text}}</div>
		</a>
	</li>
</ul>