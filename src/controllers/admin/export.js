const fs = require('fs');
const { parseAsync } = require('json2csv');
const exportTableRepository = require('../../repositories/export');
const response = require('../../utils/response');
const { uploadFile } = require('../../utils/storage');

const exportTables = async (ctx) => {
	const dreamersSummary = await exportTableRepository.dreamersSummary();
	const supportersSummary = await exportTableRepository.supportersSummary();
	const matchSummary = await exportTableRepository.matchSummary();

	if (dreamersSummary && supportersSummary && matchSummary) {
		const options = { delimiter: '\t' };

		const dreamersSummaryJson = JSON.parse(JSON.stringify(dreamersSummary));
		const supportersSummaryJson = JSON.parse(
			JSON.stringify(supportersSummary)
		);
		const matchSummaryJson = JSON.parse(JSON.stringify(matchSummary));

		const dreamersSummaryJsonParsed = await parseAsync(
			dreamersSummaryJson,
			options
		);
		const supportersSummaryJsonParsed = await parseAsync(
			supportersSummaryJson,
			options
		);
		const matchSummaryJsonParsed = await parseAsync(
			matchSummaryJson,
			options
		);

		fs.writeFileSync(
			`C:/Users/joaoi/Downloads/dreamersSummary.csv`,
			`\ufeff${dreamersSummaryJsonParsed}`,
			{ encoding: 'utf16le' },
			function (err) {
				if (err) throw err;
				console.log('dreamersSummary saved');
			}
		);

		fs.writeFileSync(
			`C:/Users/joaoi/Downloads/supportersSummary.csv`,
			`\ufeff${supportersSummaryJsonParsed}`,
			{ encoding: 'utf16le' },
			function (err) {
				if (err) throw err;
				console.log('supportersSummary saved');
			}
		);

		fs.writeFileSync(
			`C:/Users/joaoi/Downloads/matchSummary.csv`,
			`\ufeff${matchSummaryJsonParsed}`,
			{ encoding: 'utf16le' },
			function (err) {
				if (err) throw err;
				console.log('matchSummary saved');
			}
		);

		const { url: dreamersSummaryUrl } = await uploadFile({
			fileName: 'dreamersSummary.csv',
			filePath: `C:/Users/joaoi/Downloads/dreamersSummary.csv`,
			fileType: 'application/octet-stream',
			name: '',
			contentDisposition: 'attachment; filename="dreamersSummary.csv"',
		});

		const { url: supportersSummaryUrl } = await uploadFile({
			fileName: 'supportersSummary.csv',
			filePath: `C:/Users/joaoi/Downloads/supportersSummary.csv`,
			fileType: 'application/octet-stream',
			name: '',
			contentDisposition: 'attachment; filename="supportersSummary.csv"',
		});

		const { url: matchSummaryUrl } = await uploadFile({
			fileName: 'matchSummary.csv',
			filePath: `C:/Users/joaoi/Downloads/matchSummary.csv`,
			fileType: 'application/octet-stream',
			name: '',
			contentDisposition: 'attachment; filename="matchSummary.csv"',
		});

		return response(ctx, 200, {
			sheetsUrl: [
				dreamersSummaryUrl,
				supportersSummaryUrl,
				matchSummaryUrl,
			],
		});
	}
	return response(ctx, 500, {
		message: 'as tabelas não puderam ser exportadas',
	});
};

module.exports = { exportTables };
