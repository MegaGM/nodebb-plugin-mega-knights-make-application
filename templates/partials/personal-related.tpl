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
												<!-- IF areas.personal-firstname -->
												<div id="personal-firstname" class="form-control">
														{areas.personal-firstname}
												</div>
												<!-- ELSE -->
												<input id="personal-firstname" class="form-control" type="text" placeholder="myskypelogin">
												<!-- ENDIF areas.personal-firstname -->
										</div>

								</div>

								<div class="col-xs-2">
										<div class="form-group">
												<label for="personal-age">Возраст</label>
												<br>
												<!-- IF areas.personal-age -->
												<div id="personal-age" class="form-control">
														{areas.personal-age}
												</div>
												<!-- ELSE -->
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
												<!-- ENDIF areas.personal-age -->
										</div>
								</div>

								<div class="col-xs-12">
										<div class="form-group">
												<label for="personal-location">Страна и город проживания</label>
												<br>
												<!-- IF areas.personal-location -->
												<div id="personal-location" class="form-control">
														{areas.personal-location}
												</div>
												<!-- ELSE -->
												<input id="personal-location" class="form-control" type="text" placeholder="myskypelogin">
												<!-- ENDIF areas.personal-location -->
										</div>
								</div>
						</div>

				</div>
				<div class="col-xs-12 col-md-6">
						<div class="form-group">
								<label for="personal-aboutme">Расскажите немного о себе</label>
								<!-- IF areas.personal-aboutme -->
								<div id="personal-aboutme" class="form-control">
										{areas.personal-aboutme}
								</div>
								<!-- ELSE -->
								<textarea id="personal-aboutme" class="form-control" rows="5" placeholder="Чем живёте? Чего достигли? К чему стремитесь?"></textarea>
								<!-- ENDIF areas.personal-aboutme -->
						</div>
				</div>

		</div>

		<hr>
		<h3 class="header">Контактная информация</h3>

		<div class="row">

				<div class="col-xs-12 col-sm-6">
						<div class="form-group">
								<label for="contact-skype">Skype</label>
								<br>
								<!-- IF areas.contact-skype -->
								<div id="contact-skype" class="form-control">
										{areas.contact-skype}
								</div>
								<!-- ELSE -->
								<input id="contact-skype" class="form-control" type="text" placeholder="myskypelogin">
								<!-- ENDIF areas.contact-skype -->
						</div>
				</div>

				<div class="col-xs-12 col-sm-6">
						<div class="form-group">
								<label for="contact-social-club">Профиль Social Club</label>
								<br>
								<!-- IF areas.contact-social-club -->
								<div id="contact-social-club" class="form-control">
										<a href="{areas.contact-social-club}">{areas.contact-social-club-parsed}</a>
								</div>
								<!-- ELSE -->
								<input id="contact-social-club" class="form-control" type="text" placeholder="http://socialclub.rockstargames.com/member/*****">
								<!-- ENDIF areas.contact-social-club -->
						</div>
				</div>

				<div class="col-xs-12 col-sm-6">
						<div class="form-group">
								<label for="contact-steam">Steam</label>
								<br>
								<!-- IF areas.contact-steam -->
								<div id="contact-steam" class="form-control">
										<a href="{areas.contact-steam}">{areas.contact-steam-parsed}</a>
								</div>
								<!-- ELSE -->
								<input id="contact-steam" class="form-control" type="text" placeholder="http://steamcommunity.com/id/*****">
								<!-- ENDIF areas.contact-steam -->
						</div>
				</div>

				<div class="col-xs-12 col-sm-6">
						<div class="form-group">
								<label for="contact-4game">Профиль на форуме 4Game</label>
								<br>
								<!-- IF areas.contact-4game -->
								<div id="contact-4game" class="form-control">
										<a href="{areas.contact-4game}">{areas.contact-4game-parsed}</a>
								</div>
								<!-- ELSE -->
								<input id="contact-4game" class="form-control" type="text" placeholder="https://4gameforum.com/members/1234567">
								<!-- ENDIF areas.contact-4game -->
						</div>
				</div>

				<div class="col-xs-12 col-sm-6">
						<div class="form-group">
								<label for="contact-vk">ВКонтакте</label>
								<br>
								<!-- IF areas.contact-vk -->
								<div id="contact-vk" class="form-control">
										<a href="{areas.contact-vk}">{areas.contact-vk-parsed}</a>
								</div>
								<!-- ELSE -->
								<input id="contact-vk" class="form-control" type="text" placeholder="https://vk.com/****">
								<!-- ENDIF areas.contact-vk -->
						</div>
				</div>

				<div class="col-xs-12 col-sm-6">
						<div class="form-group">
								<label for="contact-gamersfirst">Профиль на форуме GamersFirst</label>
								<br>
								<!-- IF areas.contact-gamersfirst -->
								<div id="contact-gamersfirst" class="form-control">
										<a href="{areas.contact-gamersfirst}">{areas.contact-gamersfirst-parsed}</a>
								</div>
								<!-- ELSE -->
								<input id="contact-gamersfirst" class="form-control" type="text" placeholder="http://uploads.forums.gamersfirst.com/user/1234567-*****">
								<!-- ENDIF areas.contact-gamersfirst -->
						</div>
				</div>
		</div>

</div>
