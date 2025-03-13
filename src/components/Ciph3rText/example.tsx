import React from "react";
import Ciph3rText from "./index";

export default function Ciph3rTextExample(): React.ReactElement {
  return (
    <div className="p-8 space-y-8">
      <div className="text-2xl">
        <h2 className="mb-4 text-xl font-bold">Wave with colorized words:</h2>
        <Ciph3rText
          defaultText="This text has colorized words that maintain consistent colors during wave animation"
          action="wave"
          preserveSpaces={true}
          colorizeWords={true}
        />
      </div>

      <div className="text-2xl">
        <h2 className="mb-4 text-xl font-bold">Decode with colorized words:</h2>
        <Ciph3rText
          defaultText="Words are colorized consistently even during the decoding animation"
          action="decode"
          preserveSpaces={true}
          colorizeWords={true}
        />
      </div>

      <div className="text-2xl">
        <h2 className="mb-4 text-xl font-bold">
          Regular wave without colorized words:
        </h2>
        <Ciph3rText
          defaultText="Regular wave without colorized words"
          action="wave"
          preserveSpaces={true}
          colorizeWords={false}
        />
      </div>
    </div>
  );
}
