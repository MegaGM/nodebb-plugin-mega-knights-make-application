<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="row make-application-container">
	<div class="col-xs-12 make-application-layout">

		<div class="row welcome-message-layout">
			<div class="col-xs-12 welcome-message">
				<h2 class="header">Подать заявку на вступление в Knights</h2>
				<div class="content">
					<strong>1. (~2 мин) Внимательно прочитать Кодекс Рыцарей (Устав).</strong>
					<br> Этот аподиктический документ был принят к исполнению более шести лет назад и прошел проверку на сотнях прецедентов. Все в Knights от гостей до Лидера могут быть осуждены по Кодексу Рыцарей. Незнание не освобождает от ответственности.
					<br>
					<br>
					<strong>2. (5~15 мин) Заполнить анкету.</strong>
					<br> Если Вы не желаете, чтобы рассмотрение заявки затягивалось - не поленитесь заполнить как можно больше полей. Лучше сделать это сразу, чем потом Вас об этом явно попросят Рекрутеры.
					<br>
					<br>
					<strong>3. Зайти на наш сервер TeamSpeak для прохождения собеседования.</strong>
					<br> Адрес как у сайта, Knights.pro Вам не нужно никого искать или покать. Ответственные за рекрутинг люди сами обратятся к Вам.
					<br>
				</div>
				<div class="apply">
					<button class="btn btn-info accept-instruction-btn">Продолжить</button>
				</div>
			</div>
		</div>

		<div class="row statute-layout">
			<div class="col-xs-12 statute">
				<h2 class="header">Кодекс Рыцарей (Устав)</h2>
				<div class="content">{statute}</div>
				<div class="apply">
					<button class="btn btn-info accept-statute-btn" disabled="disabled">Продолжить</button>
					<div class="checkbox-inline">
						<label>
							<input type="checkbox" class="accept-statute-checkbox"> Я даю своё слово блюсти Кодекс Рыцарей
						</label>
					</div>
				</div>
			</div>
		</div>

		<div class="row application-form-layout">
			<div class="col-xs-12 application-form">
				<img id="application-form-logo" src="/plugins/nodebb-plugin-mega-knights-make-application/img/mega.knights.screen_88.png" alt="" />
				<h2 class="header text-center">Анкета кандидата на вступление в Knights</h2>

				<div class="form-inline text-center">
					<div class="form-group choose-game">
						<label>Выберите подразделения, в которые желаете вступить</label>
						<br>
						<div class="checkbox">
							<label for="i-choose-apb">
								<input type="checkbox" id="i-choose-apb" data-game="apb"> APB: Reloaded
							</label>
						</div>
						<div class="checkbox">
							<label for="i-choose-bns">
								<input type="checkbox" id="i-choose-bns" data-game="bns"> Blade and Soul
							</label>
						</div>
						<div class="checkbox">
							<label for="i-choose-gta">
								<input type="checkbox" id="i-choose-gta" data-game="gta"> GTA Online
							</label>
						</div>
					</div>
				</div>

				{personalRelated} {apbRelated} {bnsRelated} {gtaRelated}

				<div class="validator-errors"></div>
				<button type="submit" class="btn btn-default btn-info submit-application">Продолжить</button>
			</div>
		</div>
	</div>
</div>
