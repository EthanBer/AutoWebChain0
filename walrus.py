import os

def walrusPush(file):
    os.system("walrus-testnet-latest-macos-arm64 json \"$(cat /{file})\" >> output.json")


if __name__ == "__main__":
    #you will write log file
    #then you will send path to walruspush
    os.system("walrus-testnet-latest-macos-arm64 json \"$(cat /{file})\" >> output.json")
