<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="row make-application-container">
	<div class="col-xs-12 make-application-layout">

		<div class="row welcome-message-layout">
			<div class="col-xs-12 welcome-message">
				<h2 class="header">Я решил подать заявку на вступление в Knights</h2>
				<h3 class="header">Что следует сделать?</h3>
				<div class="content">
					<strong>1. Внимательно изучить Кодекс Рыцарей. (~2 мин)</strong>
					<br> Этот аподиктический документ был принят к исполнению более шести лет назад и прошел проверку на сотнях прецедентов. Все посетители ресурсов Knights, в том числе анонимные, могут быть осуждены по Кодексу Рыцарей. Незнание статей Кодекса не освобождает от ответственности за нарушение регламента.
					<br>
					<br>
					<strong>2. Заполнить бланк заявления. (5~15 мин)</strong>
					<br> 
					В голосованиях, определяющих судьбу новых кандидатов, участвуют все Рыцари. Чем солиднее выглядит заявка, тем больше шансов получить Рыцарские голоса одобрения. Лучше сразу заполнить побольше полей, чтобы рассмотрение прошло как по маслу.
					<br>
					<br>
					<strong>3. Зайти на сервер TeamSpeak, по адресу: Knights.pro</strong>
					<br> Даже не нужно никого искать или покать. Ответственные за рекрутинг люди сами начнут беседу.
					<br>
					<br>
					<strong>4. Стать богатым и знаменитым.</strong>
					<br> Начать бесплатное обучение для быстрого карьерного роста в Knights и получать зарплату за:
					<p style="padding-left: 1em;">
						поиск новых кандидатов
						<br> рассмотрение заявок на вступление
						<br> проведение собеседований
						<br> проведение внутриигровых тестов
						<br> верификацию собранных данных
						<br> расследование инцидентов с участием Рыцарей
						<br> исполнение наказаний, предусмотренных в статьях Кодекса
						<br> многое другое, в основном позитивное
						<br>
			  		</p>
					<br>
					<br> Получи легендарный клан-тег Knights, годами прославляемый лучшими игроками коммьюнити!
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
