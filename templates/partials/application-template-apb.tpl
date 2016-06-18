<div class="row make-application-container">
	<div class="col-xs-12 make-application-layout">

		<div class="row application-form-layout">
			<div class="col-xs-12 application-form">

				<div class="personal-related">
					<h3 class="header">Персональная информация</h3>

					<div class="form-inline">
						<div class="form-group">
							<label for="personal-firstname">Имя:</label>
							<span id="personal-firstname" class="form-control">{areas.personal-firstname}</span>
						</div>
						<div class="form-group">
							<label for="personal-age">Возраст:</label>
							<span id="personal-age" class="form-control">{areas.personal-age}</span>
						</div>
						<div class="form-group">
							<label for="personal-location">Страна и город:</label>
							<span id="personal-location" class="form-control">{areas.personal-location}</span>
						</div>
					</div>

					<div class="form-inline">
						<label for="personal-aboutme">Обо мне:</label>
						<span id="personal-aboutme" class="form-control">{areas.personal-aboutme}</span>
					</div>

					<div class="form-inline">
						<label for="contact-skype">Skype:</label>
						<span id="contact-skype" class="form-control">{areas.contact-skype}</span>
					</div>

					<div class="form-inline">
						<label for="contact-vk">VK:</label>
						<span id="contact-vk" class="form-control">{areas.contact-vk}</span>
					</div>
				</div>

				<div class="apb-related">
					<hr>
					<h3 class="header">APB: Reloaded</h3>

					<div class="form-group">
						<label for="apb-previous-clans">В хронологическом порядке перечислите названия всех кланов, в которых состояли все Ваши персонажи</label>
						<textarea id="apb-previous-clans" class="form-control" rows="2" placeholder="WASP, 8Bit, BitFenix"></textarea>
					</div>

					<div class="form-group">
						<label for="apb-leave-reasons">Причины, по которым Вы покинули предыдущие кланы</label>
						<span id="apb-leave-reasons" class="form-control" rows="3" placeholder="WASP: проиграли на конкурсе MissAPB 1999 - я не стерпел. 8Bit: не понимаю английского языка, решил уйти. BitFenix: был конфликт с членами клана, неподелили грабящую серебряшку с $80k, я просил ребят дать её мне, а они ни в какую"></span>
					</div>

					<div class="chars panel panel-info" data-game="apb">
						<div class="panel-heading">Ваши персонажи в игре APB: Reloaded</div>
						<div class="panel-body">
							<div class="charlist"></div>
							<i class="charlist-add fa fa-user-plus text-success fa-2x"></i>
						</div>

					</div>
				</div>
			</div>
		</div>
	</div>
</div>
