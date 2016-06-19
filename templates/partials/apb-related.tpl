<div class="apb-related" data-game="apb">
	<hr>
	<h3 class="header">APB: Reloaded</h3>

	<div class="row">

		<div class="col-xs-12 col-md-8">
			<div class="form-group">
				<label for="apb-previous-clans">Названия всех кланов, в которых состояли все Ваши персонажи</label>
				<input id="apb-previous-clans" class="form-control" type="text" placeholder="WASP, 8Bit, BitFenix">
			</div>

			<div class="form-group">
				<label for="apb-leave-reasons">Причины, по которым Вы покинули предыдущие кланы</label>
				<textarea id="apb-leave-reasons" class="form-control" rows="3" placeholder="WASP: проиграли на конкурсе MissAPB 1999 - я не стерпел. 8Bit: не понимаю английского языка, решил уйти. BitFenix: был конфликт с членами клана, неподелили грабящую серебряшку с $80k, я просил ребят дать её мне, а они ни в какую"></textarea>
			</div>
		</div>

		<div class="col-xs-12 col-md-4">
			<div class="form-group">
				<label for="apb-char-{charI}-screenshot-url-lobby">Скриншот меню выбора персонажей</label>
				<br>
				<div class="screenshot-placeholder">
					<i class="icon fa fa-cloud-upload fa-3x"></i>
					<input id="apb-char-{charI}-screenshot-url-lobby" class="screenshot-url" type="text">

					<form class="screenshot-form" action="/api/post/upload" method="post" enctype="multipart/form-data">
						<input class="screenshot-fileinput" type="file" name="files[]">
					</form>
				</div>
			</div>

		</div>

	</div>

	<div class="chars panel panel-info" data-game="apb">
		<div class="panel-heading">Ваши персонажи в игре APB: Reloaded</div>
		<div class="panel-body">
			<div class="charlist"></div>
			<i class="charlist-add fa fa-user-plus text-success fa-2x"></i>
		</div>

	</div>
</div>
