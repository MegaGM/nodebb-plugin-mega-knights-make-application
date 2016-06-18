<div id="bns-char-{charI}" class="char bns-char" data-char-index="{charI}">
	<div class="row">
		<!-- char remove column -->
		<div class="col-xs-12 col-md-1">
			<i class="charlist-remove fa fa-user-times text-danger fa-2x"></i>
		</div>

		<!-- inputs' column -->
		<div class="col-xs-12 col-md-7">

			<!-- first row -->
			<div class="row no-gutters">
				<div class="col-xs-6">
					<div class="form-group">
						<label for="bns-char-{charI}-nickname">Никнейм</label>
						<br>
						<input id="bns-char-{charI}-nickname" class="form-control" type="text" placeholder="Kempington">
					</div>
				</div>

				<div class="col-xs-6">
					<div class="form-group">
						<label for="bns-char-{charI}-renames">Ренеймы</label>
						<br>
						<input id="bns-char-{charI}-renames" class="form-control" type="text" placeholder="ShiniDesu, Dopefish">
					</div>
				</div>
			</div>


			<!-- second row -->
			<div class="row no-gutters">

				<div class="col-xs-4">
					<div class="form-group">
						<label for="bns-char-{charI}-server">Сервер</label>
						<br>
						<select id="bns-char-{charI}-server" class="form-control">
							<option value="ruby" selected="selected">Рубин</option>
						</select>
					</div>
				</div>

				<div class="col-xs-4">
					<div class="form-group">
						<label for="bns-char-{charI}-faction">Фракция</label>
						<br>
						<select id="bns-char-{charI}-faction" class="form-control">
							<option value="not-selected" selected="selected">...</option>
							<option value="murim">Мурим</option>
							<option value="muslim">Muslim</option>
						</select>
					</div>
				</div>

				<div class="col-xs-4">
					<div class="form-group">
						<label for="bns-char-{charI}-level">Уровень</label>
						<br>
						<select id="bns-char-{charI}-level" class="bns-char-level form-control">
							<option value="not-selected" selected="selected">...</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
						</select>
					</div>
				</div>

			</div>

		</div>

		<!-- screenshot column -->
		<div class="col-xs-12 col-md-4">
			<div class="form-group inline-block">
				<label for="bns-char-{charI}-screenshot-url-charstats">Скриншот статистики персонажа</label>
				<br>
				<div class="screenshot-placeholder">
					<i class="icon fa fa-cloud-upload fa-3x"></i>
					<input id="bns-char-{charI}-screenshot-url-charstats" class="screenshot-url" type="text">

					<form class="screenshot-form" action="/api/post/upload" method="post" enctype="multipart/form-data">
						<input class="screenshot-fileinput" type="file" name="files[]">
					</form>
				</div>
			</div>

		</div>

	</div>

	<hr />
</div>
