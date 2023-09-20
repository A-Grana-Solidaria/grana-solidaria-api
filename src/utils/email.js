const nodemailer = require('nodemailer');
require('dotenv').config();

const config = {
	host: process.env.MAILTRAP_HOST,
	port: process.env.MAILTRAP_PORT,
	secure: false,
	auth: {
		user: process.env.MAILTRAP_USER,
		pass: process.env.MAILTRAP_PASS,
	},
};

const transport = nodemailer.createTransport(config);

const sendEmail = async (to, subject, html) => {
	transport.sendMail({
		from: `"Grana Solidária" <${process.env.MAILTRAP_USER}>`,
		to,
		subject,
		html,
	});
};

const emailConfirmed = (url) => {
	return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html
		xmlns="http://www.w3.org/1999/xhtml"
		style="
			font-family: Lato, sans-serif;
			box-sizing: border-box;
			font-size: 14px;
			margin: 0;
		"
	>
		<head>
			<meta name="viewport" content="width=device-width" />
			<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
			<title>Grana Solidária</title>
	
			<style type="text/css">
				img {
					max-width: 100%;
				}
				body {
					-webkit-font-smoothing: antialiased;
					-webkit-text-size-adjust: none;
					width: 100% !important;
					height: 100%;
					line-height: 1.6em;
				}
				body {
					background-color: #234355;
				}
				@media only screen and (max-width: 640px) {
					body {
						padding: 0 !important;
					}
					h1 {
						font-weight: 800 !important;
						margin: 20px 0 5px !important;
					}
					h2 {
						font-weight: 800 !important;
						margin: 20px 0 5px !important;
					}
					h3 {
						font-weight: 800 !important;
						margin: 20px 0 5px !important;
					}
					h4 {
						font-weight: 800 !important;
						margin: 20px 0 5px !important;
					}
					h1 {
						font-size: 22px !important;
					}
					h2 {
						font-size: 18px !important;
					}
					h3 {
						font-size: 16px !important;
					}
					.container {
						padding: 0 !important;
						width: 100% !important;
					}
					.content {
						padding: 0 !important;
					}
					.content-wrap {
						padding: 10px !important;
					}
					.invoice {
						width: 100% !important;
					}
				}
			</style>
		</head>
	
		<body
			itemscope
			itemtype="http://schema.org/EmailMessage"
			style="
				font-family: Lato, sans-serif;
				box-sizing: border-box;
				font-size: 14px;
				-webkit-font-smoothing: antialiased;
				-webkit-text-size-adjust: none;
				width: 100% !important;
				height: 100%;
				line-height: 1.6em;
				background-color: #234355;
				margin: 0;
			"
			bgcolor="#234355"
		>
			<table
				class="body-wrap"
				style="
					font-family: Lato, sans-serif;
					box-sizing: border-box;
					font-size: 14px;
					width: 100%;
					background-color: #234355;
					margin: 0;
				"
				bgcolor="#234355"
			>
				<tr
					style="
						font-family: Lato, sans-serif;
						box-sizing: border-box;
						font-size: 14px;
						margin: 0;
					"
				>
					<td
						style="
							font-family: Lato, sans-serif;
							box-sizing: border-box;
							font-size: 14px;
							vertical-align: top;
							margin: 0;
						"
						valign="top"
					></td>
					<td
						class="container"
						width="600"
						style="
							font-family: Lato, sans-serif;
							box-sizing: border-box;
							font-size: 14px;
							vertical-align: top;
							display: block !important;
							max-width: 600px !important;
							clear: both !important;
							margin: 0 auto;
						"
						valign="top"
					>
						<div
							class="content"
							style="
								font-family: Lato, sans-serif;
								box-sizing: border-box;
								font-size: 14px;
								max-width: 600px;
								display: block;
								margin: 0 auto;
								padding: 20px;
							"
						>
							<table
								class="main"
								width="100%"
								cellpadding="0"
								cellspacing="0"
								itemprop="action"
								itemscope
								itemtype="http://schema.org/ConfirmAction"
								style="
									font-family: Lato, sans-serif;
									box-sizing: border-box;
									font-size: 14px;
									border-radius: 1em;
									background-color: #fff;
									margin: 0;
									border: 1px solid #e9e9e9;
								"
								bgcolor="#fff"
							>
								<tr
									style="
										font-family: Lato, sans-serif;
										box-sizing: border-box;
										font-size: 14px;
										margin: 0;
									"
								>
									<td
										class="content-wrap"
										style="
											font-family: Lato, sans-serif;
											box-sizing: border-box;
											font-size: 14px;
											vertical-align: top;
											margin: 0;
											padding: 20px;
										"
										valign="top"
									>
										<meta
											itemprop="name"
											content="Confirm Email"
											style="
												font-family: Lato, sans-serif;
												box-sizing: border-box;
												font-size: 14px;
												margin: 0;
											"
										/>
										<table
											width="100%"
											cellpadding="0"
											cellspacing="0"
											style="
												font-family: Lato, sans-serif;
												box-sizing: border-box;
												font-size: 14px;
												margin: 0;
											"
										>
											<tr
												style="
													font-family: Lato, sans-serif;
													box-sizing: border-box;
													font-size: 14px;
													margin: 0;
												"
											>
												<td
													class="content-block"
													style="
														font-family: Lato,
															sans-serif;
														box-sizing: border-box;
														font-size: 14px;
														vertical-align: top;
														margin: 0;
														padding: 0 0 20px;
														text-align: center;
													"
													valign="top"
												>
													<img
														style="width: 9em"
														src="https://i.pinimg.com/originals/39/c6/de/39c6de9fc1dc88e3e235103dfdbf9dba.png"
													/>
													<h1
														style="
															color: #234355;
															margin: 0.8em 0;
															line-height: 1.2;
														"
													>
														Seja bem-vindo ao<br />Grana
														Solidária!
													</h1>
													<div
														style="
															text-align: center;
															color: #000000;
															font-weight: 600;
														"
													>
														<span>
															Estamos muito felizes
															com o seu registo!
															<br />
															Por favor confirma o seu
															email clicando no botão
															abaixo ou clicando
															<a
																style="
																	color: #f57547;
																	text-decoration: none;
																"
																href="${url}"
																>aqui</a
															>
														</span>
													</div>
												</td>
											</tr>
											<tr
												style="
													font-family: Lato, sans-serif;
													box-sizing: border-box;
													font-size: 14px;
													margin: 0;
												"
											></tr>
											<tr
												style="
													font-family: Lato, sans-serif;
													box-sizing: border-box;
													font-size: 14px;
													margin: 0;
												"
											>
												<td
													class="content-block"
													itemprop="handler"
													itemscope
													itemtype="http://schema.org/HttpActionHandler"
													style="
														font-family: Lato,
															sans-serif;
														box-sizing: border-box;
														font-size: 14px;
														vertical-align: top;
														margin: 0;
														padding: 0 0 20px;
														text-align: center;
													"
													valign="top"
												>
													<a
														href="${url}"
														style="
															text-decoration: none;
															font-size: 1em;
															padding: 0.8em 4em;
															background-color: #db511f;
															border: 0;
															box-shadow: 0px 4px 4px
																rgba(0, 0, 0, 0.25);
															border-radius: 0.5em;
															color: white;
															margin: 2em 1em;
														"
													>
														Confirmar e-mail
													</a>
												</td>
											</tr>
											<tr
												style="
													font-family: Lato, sans-serif;
													box-sizing: border-box;
													font-size: 14px;
													margin: 0;
												"
											>
												<td
													class="content-block"
													itemprop="handler"
													itemscope
													itemtype="http://schema.org/HttpActionHandler"
													style="
														font-family: Lato,
															sans-serif;
														box-sizing: border-box;
														font-size: 14px;
														vertical-align: top;
														margin: 0;
														padding: 15px 0 10px;
													"
													valign="top"
												>
													<div
														style="
															font-weight: 300;
															font-size: 0.8em;
															color: #979797;
															text-align: center;
														"
													>
														<span
															>Você recebeu essa
															mensagem por engano?<br />
	
															Por favor desconsiderar
															esse e-mail se
															positivo.</span
														>
													</div>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
							<div
								class="footer"
								style="
									font-family: Lato, sans-serif;
									box-sizing: border-box;
									font-size: 14px;
									width: 100%;
									clear: both;
									color: #999;
									margin: 0;
									padding: 20px;
								"
							>
								<table
									width="100%"
									style="
										font-family: Lato, sans-serif;
										box-sizing: border-box;
										font-size: 14px;
										margin: 0;
									"
								>
									<tr
										style="
											font-family: Lato, sans-serif;
											box-sizing: border-box;
											font-size: 14px;
											margin: 0;
										"
									>
										<td
											class="aligncenter content-block"
											style="
												font-family: Lato, sans-serif;
												box-sizing: border-box;
												font-size: 12px;
												vertical-align: top;
												color: #999;
												text-align: center;
												margin: 0;
											"
											align="center"
											valign="top"
										>
											<img
												style="width: 10em"
												src="https://pbs.twimg.com/media/Eu8J1T2XEAMtvh2?format=png&name=240x240"
											/>
										</td>
									</tr>
									<tr
										style="
											font-family: Lato, sans-serif;
											box-sizing: border-box;
											font-size: 14px;
											margin: 0;
										"
									>
										<td
											class="aligncenter content-block"
											style="
												font-family: Lato, sans-serif;
												box-sizing: border-box;
												font-size: 12px;
												vertical-align: top;
												color: #999;
												text-align: center;
												margin: 0;
												padding: 0 0 20px;
											"
											align="center"
											valign="top"
										>
											<span
												>Todos os direitos reservados |
												2021</span
											>
										</td>
									</tr>
								</table>
							</div>
						</div>
					</td>
					<td
						style="
							font-family: Lato, sans-serif;
							box-sizing: border-box;
							font-size: 14px;
							vertical-align: top;
							margin: 0;
						"
						valign="top"
					></td>
				</tr>
			</table>
		</body>
	</html>
	`;
};
const emailSupport = (name, valor, quotas, total) =>{
return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
	xmlns="http://www.w3.org/1999/xhtml"
	style="
		font-family: Lato, sans-serif;
		box-sizing: border-box;
		font-size: 14px;
		margin: 0;
	"
>
	<head>
		<meta name="viewport" content="width=device-width" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<title>Grana Solidária</title>

		<style type="text/css">
			img {
				max-width: 100%;
			}
			body {
				-webkit-font-smoothing: antialiased;
				-webkit-text-size-adjust: none;
				width: 100% !important;
				height: 100%;
				line-height: 1.6em;
			}
			body {
				background-color: #234355;
			}
			@media only screen and (max-width: 640px) {
				body {
					padding: 0 !important;
				}
				h1 {
					font-weight: 800 !important;
					margin: 20px 0 5px !important;
				}
				h2 {
					font-weight: 800 !important;
					margin: 0 0 5px !important;
				}
				h3 {
					font-weight: 800 !important;
					margin: 20px 0 5px !important;
				}
				h4 {
					font-weight: 800 !important;
					margin: 20px 0 5px !important;
				}
				h1 {
					font-size: 22px !important;
				}
				h2 {
					font-size: 18px !important;
				}
				h3 {
					font-size: 16px !important;
				}
				.container {
					padding: 0 !important;
					width: 100% !important;
				}
				.content {
					padding: 0 !important;
				}
				.content-wrap {
					padding: 10px !important;
				}
				.invoice {
					width: 100% !important;
				}
			}
		</style>
	</head>

	<body
		itemscope
		itemtype="http://schema.org/EmailMessage"
		style="
			font-family: Lato, sans-serif;
			box-sizing: border-box;
			font-size: 14px;
			-webkit-font-smoothing: antialiased;
			-webkit-text-size-adjust: none;
			width: 100% !important;
			height: 100%;
			line-height: 1.6em;
			background-color: #234355;
			margin: 0;
		"
		bgcolor="#234355"
	>
		<table
			class="body-wrap"
			style="
				font-family: Lato, sans-serif;
				box-sizing: border-box;
				font-size: 14px;
				width: 100%;
				background-color: #234355;
				margin: 0;
			"
			bgcolor="#234355"
		>
			<tr
				style="
					font-family: Lato, sans-serif;
					box-sizing: border-box;
					font-size: 14px;
					margin: 0;
				"
			>
				<td
					style="
						font-family: Lato, sans-serif;
						box-sizing: border-box;
						font-size: 14px;
						vertical-align: top;
						margin: 0;
					"
					valign="top"
				></td>
				<td
					class="container"
					width="600"
					style="
						font-family: Lato, sans-serif;
						box-sizing: border-box;
						font-size: 14px;
						vertical-align: top;
						display: block !important;
						max-width: 600px !important;
						clear: both !important;
						margin: 0 auto;
					"
					valign="top"
				>
					<div
						class="content"
						style="
							font-family: Lato, sans-serif;
							box-sizing: border-box;
							font-size: 14px;
							max-width: 600px;
							display: block;
							margin: 0 auto;
							padding: 20px;
						"
					>
						<table
							class="main"
							width="100%"
							cellpadding="0"
							cellspacing="0"
							itemprop="action"
							itemscope
							itemtype="http://schema.org/ConfirmAction"
							style="
								font-family: Lato, sans-serif;
								box-sizing: border-box;
								font-size: 14px;
								border-radius: 1em;
								background-color: #fff;
								margin: 0;
								border: 1px solid #e9e9e9;
							"
							bgcolor="#fff"
						>
							<tr
								style="
									font-family: Lato, sans-serif;
									box-sizing: border-box;
									font-size: 14px;
									margin: 0;
								"
							>
								<td
									class="content-wrap"
									style="
										font-family: Lato, sans-serif;
										box-sizing: border-box;
										font-size: 14px;
										vertical-align: top;
										margin: 0;
										padding: 20px;
									"
									valign="top"
								>
									<meta
										itemprop="name"
										content="Confirm Email"
										style="
											font-family: Lato, sans-serif;
											box-sizing: border-box;
											font-size: 14px;
											margin: 0;
										"
									/>
									<table
										width="100%"
										cellpadding="0"
										cellspacing="0"
										style="
											font-family: Lato, sans-serif;
											box-sizing: border-box;
											font-size: 14px;
											margin: 0;
										"
									>
										<tr
											style="
												font-family: Lato, sans-serif;
												box-sizing: border-box;
												font-size: 14px;
												margin: 0;
											"
										>
											<td
												class="content-block"
												style="
													font-family: Lato,
														sans-serif;
													box-sizing: border-box;
													font-size: 14px;
													vertical-align: top;
													margin: 0;
													padding: 0 0 20px;
													text-align: center;
												"
												valign="top"
											>
												<img
													style="width: 9em"
													src="https://i.pinimg.com/originals/39/c6/de/39c6de9fc1dc88e3e235103dfdbf9dba.png"
												/>
												<h1
													style="
														color: #234355;
														margin: 0.8em 0;
														line-height: 1.2;
													"
												>
													Seu apoio foi registrado!
												</h1>
												<div
													style="
														text-align: center;
														color: #000000;
														font-weight: 600;
													"
												>
													<div
														style="
															margin: auto;
															/* text-align: center; */
															background: rgba(
																35,
																67,
																85,
																0.67
															);
															padding: 1em;
															border-radius: 1em;
														"
													>
														<h2>${name}</h2>
														<table
															cellpadding="0"
															cellspacing="0"
															style="
																font-family: Lato,
																	sans-serif;
																box-sizing: border-box;
																font-size: 14px;
																margin: auto;
																text-align: justify;
																border-spacing: 3em
																	0;
															"
														>
															<tr>
																<td>
																	Valor das
																	cotas
																</td>
																<td>R$${valor},00</td>
															</tr>
															<tr>
																<td>
																	Quantidade
																</td>
																<td>${quotas}</td>
															</tr>
															<tr>
																<td>Total</td>
																<td>R$${total},00</td>
															</tr>
														</table>
													</div>
												</div>
											</td>
										</tr>
										<tr
											style="
												font-family: Lato, sans-serif;
												box-sizing: border-box;
												font-size: 14px;
												margin: 0;
											"
										></tr>
										<tr
											style="
												font-family: Lato, sans-serif;
												box-sizing: border-box;
												font-size: 14px;
												margin: 0;
											"
										>
											<td
												class="content-block"
												itemprop="handler"
												itemscope
												itemtype="http://schema.org/HttpActionHandler"
												style="
													font-family: Lato,
														sans-serif;
													box-sizing: border-box;
													font-size: 14px;
													vertical-align: top;
													margin: 0;
													padding: 0 0 20px;
													text-align: center;
												"
												valign="top"
											>
												<b
													>Muito obrigado por apoiar
													este sonho!</b
												>
												<br />${name} está cada
												vez mais proximo da sua meta
												<br />Quanto maior visibilidade,
												mais chances de sucesso.
												<br />Compartilhe!
											</td>
										</tr>
										<tr
											style="
												font-family: Lato, sans-serif;
												box-sizing: border-box;
												font-size: 14px;
												margin: 0;
											"
										>
											<td
												class="content-block"
												itemprop="handler"
												itemscope
												itemtype="http://schema.org/HttpActionHandler"
												style="
													font-family: Lato,
														sans-serif;
													box-sizing: border-box;
													font-size: 14px;
													vertical-align: top;
													margin: 0;
													padding: 15px 0 10px;
												"
												valign="top"
											>
												<div
													style="
														font-weight: 300;
														font-size: 0.8em;
														color: #979797;
														text-align: center;
													"
												>
													<span
														>Você recebeu essa
														mensagem por engano?<br />

														Por favor desconsiderar
														esse e-mail se
														positivo.</span
													>
												</div>
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
						<div
							class="footer"
							style="
								font-family: Lato, sans-serif;
								box-sizing: border-box;
								font-size: 14px;
								width: 100%;
								clear: both;
								color: #999;
								margin: 0;
								padding: 20px;
							"
						>
							<table
								width="100%"
								style="
									font-family: Lato, sans-serif;
									box-sizing: border-box;
									font-size: 14px;
									margin: 0;
								"
							>
								<tr
									style="
										font-family: Lato, sans-serif;
										box-sizing: border-box;
										font-size: 14px;
										margin: 0;
									"
								>
									<td
										class="aligncenter content-block"
										style="
											font-family: Lato, sans-serif;
											box-sizing: border-box;
											font-size: 12px;
											vertical-align: top;
											color: #999;
											text-align: center;
											margin: 0;
										"
										align="center"
										valign="top"
									>
										<img
											style="width: 10em"
											src="https://pbs.twimg.com/media/Eu8J1T2XEAMtvh2?format=png&name=240x240"
										/>
									</td>
								</tr>
								<tr
									style="
										font-family: Lato, sans-serif;
										box-sizing: border-box;
										font-size: 14px;
										margin: 0;
									"
								>
									<td
										class="aligncenter content-block"
										style="
											font-family: Lato, sans-serif;
											box-sizing: border-box;
											font-size: 12px;
											vertical-align: top;
											color: #999;
											text-align: center;
											margin: 0;
											padding: 0 0 20px;
										"
										align="center"
										valign="top"
									>
										<span
											>Todos os direitos reservados |
											2021</span
										>
									</td>
								</tr>
							</table>
						</div>
					</div>
				</td>
				<td
					style="
						font-family: Lato, sans-serif;
						box-sizing: border-box;
						font-size: 14px;
						vertical-align: top;
						margin: 0;
					"
					valign="top"
				></td>
			</tr>
		</table>
	</body>
</html>`
}
const emailReset = (url) =>{
	return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html
		xmlns="http://www.w3.org/1999/xhtml"
		style="
			font-family: Lato, sans-serif;
			box-sizing: border-box;
			font-size: 14px;
			margin: 0;
		"
	>
		<head>
			<meta name="viewport" content="width=device-width" />
			<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
			<title>Grana Solidária</title>
	
			<style type="text/css">
				img {
					max-width: 100%;
				}
				body {
					-webkit-font-smoothing: antialiased;
					-webkit-text-size-adjust: none;
					width: 100% !important;
					height: 100%;
					line-height: 1.6em;
				}
				body {
					background-color: #234355;
				}
				@media only screen and (max-width: 640px) {
					body {
						padding: 0 !important;
					}
					h1 {
						font-weight: 800 !important;
						margin: 20px 0 5px !important;
					}
					h2 {
						font-weight: 800 !important;
						margin: 0 0 5px !important;
					}
					h3 {
						font-weight: 800 !important;
						margin: 20px 0 5px !important;
					}
					h4 {
						font-weight: 800 !important;
						margin: 20px 0 5px !important;
					}
					h1 {
						font-size: 22px !important;
					}
					h2 {
						font-size: 18px !important;
					}
					h3 {
						font-size: 16px !important;
					}
					.container {
						padding: 0 !important;
						width: 100% !important;
					}
					.content {
						padding: 0 !important;
					}
					.content-wrap {
						padding: 10px !important;
					}
					.invoice {
						width: 100% !important;
					}
				}
			</style>
		</head>
	
		<body
			itemscope
			itemtype="http://schema.org/EmailMessage"
			style="
				font-family: Lato, sans-serif;
				box-sizing: border-box;
				font-size: 14px;
				-webkit-font-smoothing: antialiased;
				-webkit-text-size-adjust: none;
				width: 100% !important;
				height: 100%;
				line-height: 1.6em;
				background-color: #234355;
				margin: 0;
			"
			bgcolor="#234355"
		>
			<table
				class="body-wrap"
				style="
					font-family: Lato, sans-serif;
					box-sizing: border-box;
					font-size: 14px;
					width: 100%;
					background-color: #234355;
					margin: 0;
				"
				bgcolor="#234355"
			>
				<tr
					style="
						font-family: Lato, sans-serif;
						box-sizing: border-box;
						font-size: 14px;
						margin: 0;
					"
				>
					<td
						style="
							font-family: Lato, sans-serif;
							box-sizing: border-box;
							font-size: 14px;
							vertical-align: top;
							margin: 0;
						"
						valign="top"
					></td>
					<td
						class="container"
						width="600"
						style="
							font-family: Lato, sans-serif;
							box-sizing: border-box;
							font-size: 14px;
							vertical-align: top;
							display: block !important;
							max-width: 600px !important;
							clear: both !important;
							margin: 0 auto;
						"
						valign="top"
					>
						<div
							class="content"
							style="
								font-family: Lato, sans-serif;
								box-sizing: border-box;
								font-size: 14px;
								max-width: 600px;
								display: block;
								margin: 0 auto;
								padding: 20px;
							"
						>
							<table
								class="main"
								width="100%"
								cellpadding="0"
								cellspacing="0"
								itemprop="action"
								itemscope
								itemtype="http://schema.org/ConfirmAction"
								style="
									font-family: Lato, sans-serif;
									box-sizing: border-box;
									font-size: 14px;
									border-radius: 1em;
									background-color: #fff;
									margin: 0;
									border: 1px solid #e9e9e9;
								"
								bgcolor="#fff"
							>
								<tr
									style="
										font-family: Lato, sans-serif;
										box-sizing: border-box;
										font-size: 14px;
										margin: 0;
									"
								>
									<td
										class="content-wrap"
										style="
											font-family: Lato, sans-serif;
											box-sizing: border-box;
											font-size: 14px;
											vertical-align: top;
											margin: 0;
											padding: 20px;
										"
										valign="top"
									>
										<meta
											itemprop="name"
											content="Confirm Email"
											style="
												font-family: Lato, sans-serif;
												box-sizing: border-box;
												font-size: 14px;
												margin: 0;
											"
										/>
										<table
											width="100%"
											cellpadding="0"
											cellspacing="0"
											style="
												font-family: Lato, sans-serif;
												box-sizing: border-box;
												font-size: 14px;
												margin: 0;
											"
										>
											<tr
												style="
													font-family: Lato, sans-serif;
													box-sizing: border-box;
													font-size: 14px;
													margin: 0;
												"
											>
												<td
													class="content-block"
													style="
														font-family: Lato,
															sans-serif;
														box-sizing: border-box;
														font-size: 14px;
														vertical-align: top;
														margin: 0;
														padding: 0 0 20px;
														text-align: center;
													"
													valign="top"
												>
													<img
														style="width: 9em"
														src="https://i.pinimg.com/originals/39/c6/de/39c6de9fc1dc88e3e235103dfdbf9dba.png"
													/>
													<h1
														style="
															color: #234355;
															margin: 0.8em 0;
															line-height: 1.2;
														"
													>
														Redefinição de Senha
													</h1>
												</td>
											</tr>
											<tr
												style="
													font-family: Lato, sans-serif;
													box-sizing: border-box;
													font-size: 14px;
													margin: 0;
												"
											></tr>
											<tr
												style="
													font-family: Lato, sans-serif;
													box-sizing: border-box;
													font-size: 14px;
													margin: 0;
												"
											>
												<td
													class="content-block"
													itemprop="handler"
													itemscope
													itemtype="http://schema.org/HttpActionHandler"
													style="
														font-family: Lato,
															sans-serif;
														box-sizing: border-box;
														font-size: 14px;
														vertical-align: top;
														margin: 0;
														padding: 0 0 20px;
														text-align: center;
													"
													valign="top"
												>
													<b
														>Recebemos a sua soliciação para redefinir a sua de senha
													<br />Por favor, clique no link abaixo para redefinir a sua senha e ter acesso a sua conta</b
													>
												</td>
												</tr>
												<tr
													style="
														font-family: Lato, sans-serif;
														box-sizing: border-box;
														font-size: 14px;
														margin: 0;
													"
												>
													<td
														class="content-block"
														itemprop="handler"
														itemscope
														itemtype="http://schema.org/HttpActionHandler"
														style="
															font-family: Lato,
																sans-serif;
															box-sizing: border-box;
															font-size: 14px;
															vertical-align: top;
															margin: 0;
															padding: 0 0 20px;
															text-align: center;
														"
														valign="top"
													>
														<a
															href="${url}"
															style="
																text-decoration: none;
																font-size: 1em;
																padding: 0.8em 4em;
																background-color: #db511f;
																border: 0;
																box-shadow: 0px 4px 4px
																	rgba(0, 0, 0, 0.25);
																border-radius: 0.5em;
																color: white;
																margin: 2em 1em;
															"
														>
															Redefinir senha
														</a>
													</td>
												</tr>
											<tr
												style="
													font-family: Lato, sans-serif;
													box-sizing: border-box;
													font-size: 14px;
													margin: 0;
												"
											>
												<td
													class="content-block"
													itemprop="handler"
													itemscope
													itemtype="http://schema.org/HttpActionHandler"
													style="
														font-family: Lato,
															sans-serif;
														box-sizing: border-box;
														font-size: 14px;
														vertical-align: top;
														margin: 0;
														padding: 15px 0 10px;
													"
													valign="top"
												>
													<div
														style="
															font-weight: 300;
															font-size: 0.8em;
															color: #979797;
															text-align: center;
														"
													>
														<span
															>Você recebeu essa
															mensagem por engano?<br />
	
															Por favor desconsiderar
															esse e-mail se
															positivo.</span
														>
													</div>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
							<div
								class="footer"
								style="
									font-family: Lato, sans-serif;
									box-sizing: border-box;
									font-size: 14px;
									width: 100%;
									clear: both;
									color: #999;
									margin: 0;
									padding: 20px;
								"
							>
								<table
									width="100%"
									style="
										font-family: Lato, sans-serif;
										box-sizing: border-box;
										font-size: 14px;
										margin: 0;
									"
								>
									<tr
										style="
											font-family: Lato, sans-serif;
											box-sizing: border-box;
											font-size: 14px;
											margin: 0;
										"
									>
										<td
											class="aligncenter content-block"
											style="
												font-family: Lato, sans-serif;
												box-sizing: border-box;
												font-size: 12px;
												vertical-align: top;
												color: #999;
												text-align: center;
												margin: 0;
											"
											align="center"
											valign="top"
										>
											<img
												style="width: 10em"
												src="https://pbs.twimg.com/media/Eu8J1T2XEAMtvh2?format=png&name=240x240"
											/>
										</td>
									</tr>
									<tr
										style="
											font-family: Lato, sans-serif;
											box-sizing: border-box;
											font-size: 14px;
											margin: 0;
										"
									>
										<td
											class="aligncenter content-block"
											style="
												font-family: Lato, sans-serif;
												box-sizing: border-box;
												font-size: 12px;
												vertical-align: top;
												color: #999;
												text-align: center;
												margin: 0;
												padding: 0 0 20px;
											"
											align="center"
											valign="top"
										>
											<span
												>Todos os direitos reservados |
												2021</span
											>
										</td>
									</tr>
								</table>
							</div>
						</div>
					</td>
					<td
						style="
							font-family: Lato, sans-serif;
							box-sizing: border-box;
							font-size: 14px;
							vertical-align: top;
							margin: 0;
						"
						valign="top"
					></td>
				</tr>
			</table>
		</body>
	</html>`
}
module.exports = { sendEmail, emailConfirmed, emailSupport, emailReset };
