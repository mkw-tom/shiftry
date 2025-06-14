import path from "node:path";
import moduleAlias from "module-alias";

moduleAlias.addAliases({
	"@shared": path.resolve(__dirname, "../../../../dist/packages/shared/src"),
});
