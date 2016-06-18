<div class="row make-application-container">
	<div class="col-xs-12 make-application-layout">

		<div class="row welcome-message-layout">
			<div class="col-xs-12 welcome-message">
				<h3 class="header">Порядок подачи заявки на вступление в Knights</h3>
				<div class="content">
					<strong>1.</strong>
					Ознакомиться с Кодексом Рыцарей. Если Вам чуждо всё, что там написано - нам не по пути.
					<br>
					<strong>2.</strong>
					Заполнить анкету. Встречают по одёжке.
					<br>
					<strong>3.</strong>
					Зайти в Teamspeak для прохождения собеседования. Не нужно никого искать или покать. Ответственные за рекрутинг люди сами обратятся к Вам.
					<br>
				</div>
				<div class="apply">
					<button class="btn btn-info accept-instruction-btn">Продолжить</button>
				</div>
			</div>
		</div>

		<div class="row statute-layout">
			<div class="col-xs-12 statute">
				<h3 class="header">Устав Knights</h3>
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
				<h2 class="header">Анкета кандидата на вступление в Knights</h2>

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

				<div class="personal-related">
					<hr>
					<h3 class="header">Персональная информация</h3>

					<div class="form-inline">
						<div class="form-group">
							<label for="personal-firstname">Полное настоящее имя</label>
							<br>
							<input id="personal-firstname" class="form-control" type="text" placeholder="Екатерина">
						</div>
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
						<div class="form-group">
							<label for="personal-location">Страна и город проживания</label>
							<br>
							<input id="personal-location" class="form-control" type="text" placeholder="Россия, Москва">
						</div>
					</div>

					<div class="form-group">
						<label for="personal-aboutme">Расскажите немного о себе</label>
						<textarea id="personal-aboutme" class="form-control" rows="3" placeholder="Чем живёте? Чего достигли? К чему стремитесь?"></textarea>
					</div>

					<hr>
					<h3 class="header">Контактная информация</h3>

					<div class="form-group">
						<label for="contact-skype">Ваш логин Skype</label>
						<br>
						<input id="contact-skype" class="form-control" type="text" placeholder="myskypelogin">
					</div>

					<div class="form-group">
						<label for="contact-vk">Личная страница в социальной сети ВКонтакте</label>
						<br>
						<input id="contact-vk" class="form-control" type="text" placeholder="https://vk.com/****">
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
						<textarea id="apb-leave-reasons" class="form-control" rows="3" placeholder="WASP: проиграли на конкурсе MissAPB 1999 - я не стерпел. 8Bit: не понимаю английского языка, решил уйти. BitFenix: был конфликт с членами клана, неподелили грабящую серебряшку с $80k, я просил ребят дать её мне, а они ни в какую"></textarea>
					</div>

					<div class="chars panel panel-info" data-game="apb">
						<div class="panel-heading">Ваши персонажи в игре APB: Reloaded</div>
						<div class="panel-body">
							<div class="charlist"></div>
							<i class="charlist-add fa fa-user-plus text-success fa-2x"></i>
						</div>

					</div>
				</div>


				<div class="validator-errors"></div>
				<button type="submit" class="btn btn-default btn-info submit-application">Продолжить</button>
			</div>
		</div>
	</div>
</div>