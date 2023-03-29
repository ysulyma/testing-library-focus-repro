import {Autocomplete} from "@mui/material";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {render} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {forwardRef, useImperativeHandle, useRef, useState} from "react";

export function DebugComponent() {
  const addNewRef = useRef<React.ComponentRef<typeof AddNew>>(null);

  return (
    <Autocomplete
      // value={value}
      filterOptions={(options) => options}
      freeSolo
      onChange={() => {
        addNewRef.current?.open();
      }}
      open
      options={["Test"]}
      renderInput={(params) => (
        <div key="div" ref={params.InputProps.ref}>
          <input placeholder="placeholder" {...params.inputProps} />
        </div>
      )}
      renderOption={(props) => {
        return <AddNew key="add-new" {...props} ref={addNewRef} />;
      }}
    />
  );
}

const AddNew = forwardRef<{open(): void}>(function AddNew(props, ref) {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open() {
      setOpen(true);
    },
  }));

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Content>
          {/* <AlertDialog.Cancel>Cancel</AlertDialog.Cancel> */}
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
});

describe("SpeakerAssignment", () => {
  it("should not explode", async () => {
    const {getByPlaceholderText} = render(<DebugComponent />);

    const input = getByPlaceholderText("placeholder");
    await userEvent.type(input, "Dennis");
    await userEvent.type(input, "{ArrowDown}{Enter}");
  });
});
