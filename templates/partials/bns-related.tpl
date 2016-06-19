<div class="bns-related" data-game="bns">
	<hr>
	<h3 class="header">Blade and Soul</h3>
	Основные крафтовые профессии ? (минимальный 3-й уровень) Какой у вас опыт в данной игре?
	<div class="form-group form-inline">
		<label>Что предпочитаете?</label>
		<br>
		<div class="checkbox">
			<label for="bns-i-play-pvp">
				<input type="checkbox" id="bns-i-play-pvp"> PVP
			</label>
		</div>
		<div class="checkbox">
			<label for="bns-i-play-pve">
				<input type="checkbox" id="bns-i-play-pve"> PVE
			</label>
		</div>
	</div>

	<div class="form-group form-inline">
		<label>В какое время вы находитесь в игре?</label>
		<br>
		<div class="checkbox">
			<label for="bns-i-play-morning">
				<input type="checkbox" id="bns-i-play-morning"> Утром
			</label>
		</div>
		<div class="checkbox">
			<label for="bns-i-play-day">
				<input type="checkbox" id="bns-i-play-day"> Днём
			</label>
		</div>
		<div class="checkbox">
			<label for="bns-i-play-evening">
				<input type="checkbox" id="bns-i-play-evening"> Вечером
			</label>
		</div>
		<div class="checkbox">
			<label for="bns-i-play-night">
				<input type="checkbox" id="bns-i-play-night"> Ночью
			</label>
		</div>
	</div>

	<div class="row">

		<div class="col-xs-12 col-md-8">
			<div class="form-group">
				<label for="bns-previous-clans">Названия всех кланов, в которых состояли все Ваши персонажи</label>
				<input id="bns-previous-clans" class="form-control" type="text" placeholder="WASP, 8Bit, BitFenix">
			</div>

			<div class="form-group">
				<label for="bns-leave-reasons">Причины, по которым Вы покинули предыдущие кланы</label>
				<textarea id="bns-leave-reasons" class="form-control" rows="3" placeholder="WASP: проиграли на конкурсе MissAPB 1999 - я не стерпел. 8Bit: не понимаю английского языка, решил уйти. BitFenix: был конфликт с членами клана, неподелили лут"></textarea>
			</div>
		</div>

		<div class="col-xs-12 col-md-4">
			<div class="form-group">
				<label for="bns-char-{charI}-screenshot-url-lobby">Скриншот меню выбора персонажей</label>
				<br>
				<div class="screenshot-placeholder">
					<i class="icon fa fa-cloud-upload fa-3x"></i>
					<input id="bns-char-{charI}-screenshot-url-lobby" class="screenshot-url" type="text">

					<form class="screenshot-form" action="/api/post/upload" method="post" enctype="multipart/form-data">
						<input class="screenshot-fileinput" type="file" name="files[]">
					</form>
				</div>
			</div>

		</div>

	</div>

	<div class="chars panel panel-info" data-game="bns">
		<div class="panel-heading">Ваши персонажи в игре Blade and Soul</div>
		<div class="panel-body">
			<div class="charlist"></div>
			<i class="charlist-add fa fa-user-plus text-success fa-2x"></i>
		</div>

	</div>
</div>
