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
							<input type="checkbox" class="accept-statute-checkbox"> Я клянусь блюсти Кодекс Рыцарей
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
				<div class="personal-related">
					<hr>
					<h3 class="header">Персональная информация</h3>

					<div class="row">
						<div class="col-xs-12 col-md-6">

							<div class="row no-gutters">
								<div class="col-xs-10">
									<div class="form-group">
										<label for="personal-firstname">Полное настоящее имя</label>
										<br>
										<input id="personal-firstname" class="form-control" type="text" placeholder="Екатерина">
									</div>
								</div>

								<div class="col-xs-2">
									<div class="form-group">
										<label for="personal-age">Возраст</label>
										<br>
										<select id="personal-age" class="form-control">
											<option value="not-selected" selected="selected">...</option>
											<option value="13">13</option>
											<option value="14">14</option>
											<option value="15">15</option>
											<option value="16">16</option>
											<option value="17">17</option>
											<option value="18">18</option>
											<option value="19">19</option>
											<option value="20">20</option>
											<option value="21">21</option>
											<option value="22">22</option>
											<option value="23">23</option>
											<option value="24">24</option>
											<option value="25">25</option>
											<option value="26">26</option>
											<option value="27">27</option>
											<option value="28">28</option>
											<option value="29">29</option>
											<option value="30">30</option>
											<option value="31">31</option>
											<option value="32">32</option>
											<option value="33">33</option>
											<option value="34">34</option>
											<option value="35">35</option>
											<option value="36">36</option>
											<option value="37">37</option>
											<option value="38">38</option>
											<option value="39">39</option>
											<option value="40">40</option>
											<option value="41">41</option>
											<option value="42">42</option>
											<option value="43">43</option>
											<option value="44">44</option>
											<option value="45">45</option>
											<option value="46">46</option>
											<option value="47">47</option>
											<option value="48">48</option>
											<option value="49">49</option>
											<option value="50">50</option>
											<option value="51">51</option>
											<option value="52">52</option>
											<option value="53">53</option>
											<option value="54">54</option>
											<option value="55">55</option>
											<option value="56">56</option>
											<option value="57">57</option>
											<option value="58">58</option>
											<option value="59">59</option>
										</select>
									</div>
								</div>
							</div>

							<div class="form-group">
								<label for="personal-location">Страна и город проживания</label>
								<br>
								<input id="personal-location" class="form-control" type="text" placeholder="Россия, Москва">
							</div>

						</div>
						<div class="col-xs-12 col-md-6">
							<div class="form-group">
								<label for="personal-aboutme">Расскажите немного о себе</label>
								<textarea id="personal-aboutme" class="form-control" rows="5" placeholder="Чем живёте? Чего достигли? К чему стремитесь?"></textarea>
							</div>
						</div>

					</div>


					<hr>
					<h3 class="header">Контактная информация</h3>

					<div class="row">

						<div class="col-xs-12 col-sm-6">
							<div class="form-group">
								<label for="contact-skype">Ваш логин Skype</label>
								<br>
								<input id="contact-skype" class="form-control" type="text" placeholder="myskypelogin">
							</div>
						</div>

						<div class="col-xs-12 col-sm-6">
							<div class="form-group">
								<label for="contact-vk">Профиль ВКонтакте</label>
								<br>
								<input id="contact-vk" class="form-control" type="text" placeholder="https://vk.com/****">
							</div>
						</div>

						<div class="col-xs-12 col-sm-6">
							<div class="form-group">
								<label for="contact-steam">Профиль Steam</label>
								<br>
								<input id="contact-steam" class="form-control" type="text" placeholder="http://steamcommunity.com/id/*****">
							</div>
						</div>

						<div class="col-xs-12 col-sm-6">
							<div class="form-group">
								<label for="contact-social-club">Профиль Social Club</label>
								<br>
								<input id="contact-social-club" class="form-control" type="text" placeholder="http://socialclub.rockstargames.com/member/*****">
							</div>
						</div>

						<div class="col-xs-12 col-sm-6">
							<div class="form-group">
								<label for="contact-4game">Профиль на форуме 4Game (RU)</label>
								<br>
								<input id="contact-4game" class="form-control" type="text" placeholder="https://4gameforum.com/members/1234567">
							</div>
						</div>

						<div class="col-xs-12 col-sm-6">
							<div class="form-group">
								<label for="contact-gamersfirst">Профиль на форуме GamersFirst (EU)</label>
								<br>
								<input id="contact-gamersfirst" class="form-control" type="text" placeholder="http://uploads.forums.gamersfirst.com/user/1234567-*****">
							</div>
						</div>
					</div>

				</div>

				{apbRelated} {bnsRelated} {gtaRelated}

				<div class="validator-errors"></div>
				<button type="submit" class="btn btn-default btn-info submit-application">Продолжить</button>
			</div>
		</div>
	</div>
</div>
